package effects

import (
	"fmt"
	"strings"

	"github.com/oxodao/ambientrpg/ambientclient"
	"github.com/oxodao/ambientrpg/mosquitto"
)

type SetLightEffect struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Args struct {
		DeviceName  string   `json:"device_name"`
		DeviceNames []string `json:"device_names"`
		Color       string   `json:"color"`
		Brightness  int      `json:"brightness"`
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

	for _, device := range devices {
		mosquitto.GET.DeviceSetColor(
			device,
			effect.Args.Color,
			effect.Args.Brightness,
		)
	}
	return nil
}
