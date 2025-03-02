package effects

import (
	"encoding/json"
	"fmt"
	"os"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/oxodao/ambientrpg/ambientclient"
	"github.com/oxodao/ambientrpg/mosquitto"
	sse "github.com/r3labs/sse/v2"
)

type baseEffect struct {
	Name string          `json:"name"`
	Type string          `json:"type"`
	Args json.RawMessage `json:"args"`
}

type Effect interface {
	/**
	 * PHP Effect means that something happens on the frontend
	 * This also means that the state is updated
	 * Thus every PHP effects that does not have a sleep inbetween
	 * should be merged
	 * This is important because:
	 * - It's always nice to minimize roundtrip for latency
	 * - React will fuck itself while receiving multiple message at the same time
	 **/
	IsPhpEffect() bool
	Do() error
	GetAlteredState(state ambientclient.State) ambientclient.State

	String() string
}

func Execute(effects []Effect) error {
	dirtyState := false
	state := ambientclient.GET.State

	/**
	 * This methods bundle all state-affecting effects
	 * together
	 */
	for _, fx := range effects {
		_, isSleep := fx.(SleepEffect)

		if fx.IsPhpEffect() {
			state = fx.GetAlteredState(state)
			dirtyState = true

			continue
		}

		if dirtyState && isSleep {
			dirtyState = false
			err := ambientclient.GET.SetState(state)
			if err != nil {
				fmt.Println("Failed to set state: ", state)
			}

			state = ambientclient.GET.State
		}

		err := fx.Do()

		if err != nil {
			return err
		}
	}

	if dirtyState {
		return ambientclient.GET.SetState(state)
	}

	return nil
}

func ParseEffectsFromFile(filename string) ([]Effect, error) {
	data, err := os.ReadFile(filename)

	if err != nil {
		return nil, err
	}

	return ParseEffects(data)
}

func ParseEffects(raw []byte) ([]Effect, error) {
	fmt.Println("Parsing effects...")

	var actions []json.RawMessage

	err := json.Unmarshal(raw, &actions)

	if err != nil {
		return nil, err
	}

	effects := []Effect{}

	for _, act := range actions {
		effect, err := ParseEffect(act)
		if err != nil {
			return nil, err
		}

		fmt.Println("\t- " + effect.String())
		effects = append(effects, effect)
	}

	return effects, nil
}

func ParseEffect(raw json.RawMessage) (Effect, error) {
	var base baseEffect
	if err := json.Unmarshal(raw, &base); err != nil {
		return nil, err
	}

	// @TODO: Do something about this crap
	// Sometime I love golang, but in those cases I hate it
	switch base.Type {
	case "sfx":
		var action SfxEffect

		if err := json.Unmarshal(raw, &action); err != nil {
			return nil, err
		}

		return action, nil

	case "set_light":
		var action SetLightEffect
		if err := json.Unmarshal(raw, &action); err != nil {
			return nil, err
		}

		return action, nil

	case "soundtrack":
		var action SoundtrackEffect

		if err := json.Unmarshal(raw, &action); err != nil {
			return nil, err
		}

		return action, nil

	case "sleep":
		var action SleepEffect

		if err := json.Unmarshal(raw, &action); err != nil {
			return nil, err
		}

		return action, nil

	default:
		return nil, fmt.Errorf("unknown effect type: %s", base.Type)
	}
}

func onProcessFromFile(c mqtt.Client, msg mqtt.Message) {
	data := map[string]string{}
	err := json.Unmarshal(msg.Payload(), &data)

	if err != nil {
		fmt.Println("Failed to parse onProcessFromFile body: ", err)
		return
	}

	if _, ok := data["file"]; !ok || len(data["file"]) == 0 {
		fmt.Println("Failed to parse onProcessFromFile body: Missing filename")
		return
	}

	if _, err := os.Stat(data["file"]); os.IsNotExist(err) {
		fmt.Println("Failed to parse onProcessFromFile body: file")
		return
	}

	fxs, err := ParseEffectsFromFile(data["file"])
	if err != nil {
		fmt.Println("Failed to load effects from " + data["file"])

		return
	}

	err = Execute(fxs)
	if err != nil {
		fmt.Println("Failed to execute effects from " + data["file"])

		return
	}
}

func onProcessFromJson(raw []byte) error {
	effects, err := ParseEffects(raw)
	if err != nil {
		return err
	}

	return Execute(effects)
}

func onProcessFromBody(c mqtt.Client, msg mqtt.Message) {
	if err := onProcessFromJson(msg.Payload()); err != nil {
		fmt.Println("Failed to parse effects from body: ", err)
	}
}

func OnProcessFromMercureBody(msg *sse.Event) {
	if err := onProcessFromJson(msg.Data); err != nil {
		fmt.Println("Failed to parse effects from mercure body: ", err)
	}
}

func Load() error {
	topics := map[string]mqtt.MessageHandler{
		"ambientrpg/effects_from_file": onProcessFromFile,
		"ambientrpg/effects_from_body": onProcessFromBody,
	}

	for x, y := range topics {
		err := mosquitto.GET.Subscribe(x, y)
		if err != nil {
			return err
		}
	}

	return nil
}
