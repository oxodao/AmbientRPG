# Ambient TTRPG

Ambient TTRPG is a free tool to help you do your Game Master role. It is made to be simplistic and do not aim to replace big software like Roll20.

It does not target online play and favours that everybody is in the same room, but do as you want.

This version is more a PoC than a real software. If I get enough uses of it I'll maybe rewrite it to be clean and support more stuff (e.g. self-hosted on a remote server instead of a local software)

## The weird setup

So, this is a PHP app but the goal is NOT to run it on a server. I like PHP and Api Platform makes it really easy to develop.

Though it's built running the [FrankenPHP](https://frankenphp.dev) server, so my goal is, when this feature is fixed, to release a static build that you can directly run.

## Features
- Markdown note taking
- Split your "campaign" (For lack of a better word, as it's currently more targeted at one-shots) in scenes
- Manage the images you display, sound effects and your background music (switch between multiple without restart!)
- Manage your NPC (Details / description, stats, etc...)
- Some GM utilities (Name generator, calculator, ...)

## TODO imminents
- Bouton pour CUD des OST
- Désactiver la sauvegarde auto (+ popup de warning si dirty) + bouton pour save manuellement
- Faire les widgets flottants
  - [x] Calculatrice
  - [ ] Dés
  - [ ] Liste de compétences qui existent (Sous menu de ctrl+p)
  - [ ] Générateur de nom
  - [ ] Générateur de loot
- Faire un système de duplication de campagne
  - Faut que ça puisse dupliquer sur une campagne existante (ex: j'ai ajouté une scène à un groupe, je veux la dupliquer sur les autres groupes pour qu'ils l'aient aussi, à définir)

## Roadmap

Currently the game is specifically tailored for Cyberpunk RED (the theme mainly) but making a more generic version is planned.

Todos:
- [x] Sidecar
  - [ ] Make it a Caddy plugin that handles runtime stuff, currently its a weird json I don't like this
- [x] Sound effects
- [x] Soundtrack
- [x] Led strip FX
  - [x] zigbee2mqtt
  - [ ] wled
  - [ ] Usb-wired (Custom arduino firmware to develop)
- [x] FX script API (e.g. put the lights red, trigger the combat begin sound effect, start the combat soundtrack)
    - [ ] UI editor tool (Currently is to be done in database)
- [ ] Character Manager
  - [x] Per-characters notes
  - [ ] More stuff, idk
- [ ] Toolbox (Ctrl+P)
  - [x] Calculator
  - [ ] Dices
  - [ ] NPC Name generator
  - [ ] Loot generator
- [ ] Add "stories" that goes in between campaign and scene to make the software more useful for real campaigns
  - Campaign would be the whole game
  - Story would be one story-line (e.g. one mission that can span across multiple session)
  - One scene would be the same as the current scenes

## License

For now, consider this code as a source-available but ALL RIGHTS RESERVED app.

You can use it for your own usage, there is no guarantee about anything.

Commercial usage is forbidden for now.

I did not have time to select a license that fits the project yet, that's why its all right reserved for now. I plan on choosing a correct license down the line but as the project is in its early stage no choice have been made.
