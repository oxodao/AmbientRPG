package effects

import (
	"fmt"

	"github.com/oxodao/ambientrpg/ambientclient"
)

type SfxEffect struct {
	Name string `json:"name"`
	Type string `json:"type"`
	Args struct {
		Iri string `json:"iri"`
	}
}

func (effect SfxEffect) String() string {
	return fmt.Sprintf("SfxEffect[iri=%v]", effect.Args.Iri)
}

func (effect SfxEffect) IsPhpEffect() bool {
	return true
}

func (effect SfxEffect) GetAlteredState(state ambientclient.State) ambientclient.State {
	return state.AddSoundEffect(effect.Args.Iri)
}

func (effect SfxEffect) Do() error {
	return ambientclient.GET.SetState(
		effect.GetAlteredState(ambientclient.GET.State),
	)
}
