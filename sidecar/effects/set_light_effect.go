package effects

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/oxodao/ambientrpg/ambientclient"
	"github.com/oxodao/ambientrpg/config"
	"github.com/oxodao/ambientrpg/mosquitto"
	"github.com/oxodao/ambientrpg/utils"
)

// @TODO: Add a "color" type
// It can be parsed from hex or array of int
// thus it will be able to have helper methods
// e.g. ToHex(), ToHashHex, ToArray(), ...

type SetLightEffect struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Args struct {
		DeviceName  string      `json:"device_name"`
		DeviceNames []string    `json:"device_names"`
		Color       utils.Color `json:"color"`
		Brightness  int         `json:"brightness"`
	}
}

func (effect SetLightEffect) String() string {
	devices := []string{}

	if len(effect.Args.DeviceName) > 0 {
		devices = append(devices, effect.Args.DeviceName)
	}

	if len(effect.Args.DeviceNames) > 0 {
		devices = append(devices, effect.Args.DeviceNames...)
	}

	deviceNames := "(" + strings.Join(devices, ", ") + ")"

	return fmt.Sprintf("SetLightEffect[device=%v, color=%v, brightness=%v]", deviceNames, effect.Args.Color, effect.Args.Brightness)
}

func (effect SetLightEffect) IsPhpEffect() bool {
	return false
}

func (effect SetLightEffect) GetAlteredState(state ambientclient.State) ambientclient.State {
	return state
}

func (effect SetLightEffect) Do() error {
	devices := effect.Args.DeviceNames

	if len(effect.Args.DeviceName) > 0 {
		devices = append(devices, effect.Args.DeviceName)
	}

	httpClient := http.DefaultClient
	wledBody, _ := json.Marshal(map[string]any{
		"on":  true,
		"bri": effect.Args.Brightness,
		"seg": []map[string]any{
			{
				"on":  true,
				"bri": effect.Args.Brightness,
				"col": [][]int{effect.Args.Color.ToSlice()},
			},
		},
	})

	for _, device := range devices {
		if cfg, ok := config.GET.WLedDevices[device]; ok {
			rq, err := http.NewRequest("POST", "http://"+cfg.Ip+"/json/state", bytes.NewReader(wledBody))
			if err != nil {
				fmt.Println("SetLightEffect: failed to create WLED request:", err)
				continue
			}

			_, err = httpClient.Do(rq)
			if err != nil {
				fmt.Println("SetLightEffect: failed to send WLED request:", err)
				continue
			}
		} else {
			mosquitto.GET.DeviceSetColor(
				device,
				effect.Args.Color.ToHex(),
				effect.Args.Brightness,
			)
		}
	}
	return nil
}
