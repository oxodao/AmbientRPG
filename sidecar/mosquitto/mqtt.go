package mosquitto

import (
	"encoding/json"
	"fmt"
	"strings"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/oxodao/ambientrpg/config"
)

var GET Mqtt

type Mqtt struct {
	client  *mqtt.Client
	Devices map[string]Zigbee2MqttDevice
}

func (m *Mqtt) onDevicesReceived(c mqtt.Client, msg mqtt.Message) {
	devices := []Zigbee2MqttDevice{}

	err := json.Unmarshal(msg.Payload(), &devices)

	if err != nil {
		fmt.Println("onDevicesReceived failed: ", err)
	}

	m.Devices = map[string]Zigbee2MqttDevice{}
	for _, d := range devices {
		m.Devices[d.FriendlyName] = d
	}
}

func (m *Mqtt) DeviceSetColor(friendlyName string, color string, brightness int) error {
	if !strings.HasPrefix(color, "#") {
		color = "#" + color
	}

	payload, _ := json.Marshal(map[string]any{
		"state":      "ON",
		"brightness": brightness,
		"color": map[string]any{
			"hex": color,
		},
		"transition": 0,
	})

	t := (*m.client).Publish(
		fmt.Sprintf("zigbee2mqtt/%s/set", friendlyName),
		1,
		false,
		payload,
	)

	t.Wait()

	return t.Error()
}

func (m *Mqtt) Subscribe(topic string, handler mqtt.MessageHandler) error {
	if t := (*m.client).Subscribe(topic, 0, handler); t.Wait() && t.Error() != nil {
		return t.Error()
	}

	return nil
}

func (m *Mqtt) Shutdown() {
	(*m.client).Disconnect(0)
}

func Load() error {
	var msgPubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
		fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
	}

	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%v:%v", config.GET.Mqtt.Host, config.GET.Mqtt.Port))
	opts.SetClientID("ambientrpg_sidecar")
	opts.SetUsername(config.GET.Mqtt.Username)
	opts.SetPassword(config.GET.Mqtt.Password)

	opts.SetDefaultPublishHandler(msgPubHandler)

	opts.OnConnect = func(client mqtt.Client) {
		fmt.Println("Connected to MQTT")
	}

	opts.OnConnectionLost = func(client mqtt.Client, err error) {
		fmt.Printf("MQTT connection lost: %v", err)
	}

	client := mqtt.NewClient(opts)
	if t := client.Connect(); t.Wait() && t.Error() != nil {
		return t.Error()
	}

	GET = Mqtt{
		client:  &client,
		Devices: map[string]Zigbee2MqttDevice{},
	}

	topics := map[string]mqtt.MessageHandler{
		"zigbee2mqtt/bridge/devices": GET.onDevicesReceived,
	}

	for x, y := range topics {
		err := GET.Subscribe(x, y)
		if err != nil {
			return err
		}
	}

	return nil
}
