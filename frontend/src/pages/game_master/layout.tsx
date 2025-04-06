import { Outlet } from "react-router-dom";
import TopBar from "../../components/topbar";
import { useAppProps } from "../../context";
import SoundEffectPlayer from "../../components/elements/sound_effect/sound_effect_play";

export default function GameMasterLayout({theme}: {theme: string}) {
    const {loadedSoundEffects} = useAppProps();

    return <div className={`fullsize gm ${theme}`}>
        <TopBar />

        <div className="fullsize__inner">
            <Outlet />
        </div>

        {
            ...Object.values(loadedSoundEffects)
                .map(x => <SoundEffectPlayer key={x.iri} soundEffect={x} />)
        }
    </div>
}