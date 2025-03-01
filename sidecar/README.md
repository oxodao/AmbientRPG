# AmbientRPG Sidecar

This software is a simple tool to make effect sequences in AmbientRPG

It runs alongisde the main php tool to do stuff at a bit of a lower level.

Currently its a separate executable, but my end goal is to ship this as a Caddy module (if possible), so that nothing else need to be ran.

## Setup

It requires a MQTT server, if you have Home Assistant with zigbee2mqtt you should be good to go, otherwise you can setup one using the [eclipse-mosquitto](https://hub.docker.com/_/eclipse-mosquitto) docker image.

Inside your app data folder (`./app_data` if you're using the default compose settings), create a `sidecar_config.json` with the following content:

```json
{
    "server": {
        "url": "http://app"
    },
    "mqtt": {
        "host": "192.168.14.2", // Your MQTT server, mine is my HomeAssistant's one
        "port": 1883,
        "username": "ambientrpg",
        "password": "your mqtt password"
    }
}
```

## Effects

Here are the following effect types supported:

### SFX Effect

This sends the signal to the AmbientRPG PHP server to trigger a sound effect

```json
{
    "name": "My sfx",
    "type": "sfx",
    "args": [
        "iri": "/api/sound_effects/1"
    ]
}
```

### Soundtrack Effect

This sends the signal to the AmbientRPG PHP server to switch to a different soundtrack

```json
{
    "name": "My soundtrack",
    "type": "soundtrack",
    "args": [
        "iri": "/api/soundtracks/1"
    ]
}
```

### Sleep Effect

If you need to wait a bit between multiple effects, you can use the sleep effect.

The duration is written in milliseconds

```json
{
    "name": "Waiting...",
    "type": "sleep",
    "args": [
        "duration": 2000
    ]
}
```

### Set light Effect

Currently this only supports zigbee2mqtt devices (esp. the [Lidl ledstrip](https://www.zigbee2mqtt.io/devices/HG06104A.html) not sure if Z2M light settings are standard though).

I hope one day to make it work with [WLED](https://kno.wled.ge/) and maybe USB ledstrip (to have the lowest latency possible, will need to develop an Arduino firmware for those though).

Note that it is possible to specify either `device_name` or `device_names`, both should not be set at the same time.

```json
{
    "name": "Setting red color",
    "type": "set_light",
    "args": [
        "device_name": "z2m friendly name",
        "device_names": ["z2m friendly name", "second device", "third device"],
        "color": "#FF0000",
        "brightness": 254
    ]
}
```