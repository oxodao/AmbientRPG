import { useAppProps } from "../../../context";
import SoundEffect from "../../../sdk/responses/sound_effect"

type Props = {
    soundEffect: SoundEffect;
}

export default function SoundEffectPlayer({soundEffect}: Props) {
    const {displayedSoundEffects, sendState} = useAppProps();

    const onConclude = async () => {
        if (soundEffect.loop) {
            return;
        }

        if (displayedSoundEffects.includes(soundEffect.iri)) {
            sendState({displayedSoundEffects: displayedSoundEffects.filter(x => x !== soundEffect.iri)});
        }
    };

    return <audio
        autoPlay
        src={soundEffect.url}
        loop={soundEffect.loop ?? false} // @TODO
        onEnded={onConclude}
    />
}