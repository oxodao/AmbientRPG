package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/oxodao/ambientrpg/ambientclient"
	"github.com/oxodao/ambientrpg/config"
	"github.com/oxodao/ambientrpg/effects"
	"github.com/oxodao/ambientrpg/mosquitto"
)

func main() {
	fmt.Println("Ambient TTRPG - Sidecar")
	if err := config.LoadConfig(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err := mosquitto.Load()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = effects.Load()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	err = ambientclient.Load(effects.OnProcessFromMercureBody)
	if err != nil {
		fmt.Println(err)

		os.Exit(1)
	}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	ambientclient.GET.Shutdown()
	mosquitto.GET.Shutdown()
}
