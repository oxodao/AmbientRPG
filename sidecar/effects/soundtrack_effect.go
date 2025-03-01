package effects

import (
	"fmt"

	"github.com/oxodao/ambientrpg/ambientclient"
)

type SoundtrackEffect struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Args struct {
		Iri string `json:"iri"`
	}
}

func (effect SoundtrackEffect) String() string {
	return fmt.Sprintf("SoundtrackEffect[iri=%v]", effect.Args.Iri)
}

func (effect SoundtrackEffect) IsPhpEffect() bool {
	return true
}

func (effect SoundtrackEffect) GetAlteredState(state ambientclient.State) ambientclient.State {
	return state.SetSoundtrack(effect.Args.Iri)
}

func (effect SoundtrackEffect) Do() error {
	return ambientclient.GET.SetState(effect.GetAlteredState(ambientclient.GET.State))
}
