package config

import (
	"encoding/json"
	"errors"
	"os"
)

var GET Config

type Config struct {
	Server struct {
		Url string `json:"url"`
	} `json:"server"`
	Mqtt struct {
		Host     string `json:"host"`
		Port     int    `json:"port"`
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"mqtt"`
}

func LoadConfig() error {
	configPath := os.Getenv("ARPG_SIDECAR_CONFIG")
	if len(configPath) == 0 {
		configPath = "/app_data/sidecar_config.json"
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return errors.New("config file not found (searching for path \"" + configPath + "\")")
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, &GET)
}
