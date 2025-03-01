package ambientclient

import (
	"encoding/json"
	"slices"

	"github.com/oxodao/ambientrpg/utils"
)

type StateCampaign string

func (s *StateCampaign) UnmarshalJSON(data []byte) error {
	var rawMap map[string]any
	if err := json.Unmarshal(data, &rawMap); err != nil {
		return err
	}

	if id, ok := rawMap["@id"].(string); ok {
		*s = StateCampaign(id)
	}

	return nil
}

type State struct {
	Campaign              StateCampaign `json:"campaign"`
	BackgroundDuration    int           `json:"backgroundDuration"`
	DisplayedImages       []string      `json:"displayedImages"`
	DisplayedSoundEffects []string      `json:"displayedSoundEffects"`
	PlayingSoundtrack     string        `json:"playingSoundtrack"`
}

func (state State) AddSoundEffect(iri string) State {
	if slices.Contains(state.DisplayedSoundEffects, iri) {
		return state
	}

	state.DisplayedSoundEffects = append(state.DisplayedSoundEffects, iri)

	return state
}

func (state State) RemoveSoundEffect(iri string) State {
	state.DisplayedSoundEffects = utils.Filter(state.DisplayedSoundEffects, func(s string) bool {
		return s != iri
	})

	return state
}

func (state State) SetSoundtrack(iri string) State {
	state.PlayingSoundtrack = iri

	return state
}
