package effects

import (
	"fmt"
	"time"

	"github.com/oxodao/ambientrpg/ambientclient"
)

type SleepEffect struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Args struct {
		Duration int `json:"duration"`
	}
}

func (effect SleepEffect) String() string {
	return fmt.Sprintf("SleepEffect[duration=%v]", effect.Args.Duration)
}

func (effect SleepEffect) IsPhpEffect() bool {
	return false
}

func (effect SleepEffect) GetAlteredState(state ambientclient.State) ambientclient.State {
	return state
}

func (effect SleepEffect) Do() error {
	time.Sleep(time.Duration(effect.Args.Duration) * time.Millisecond)

	return nil
}
