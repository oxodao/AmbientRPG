import { useAppProps } from "../../context";

import ImageList from "./image/image_list";
import AmbientAccordion from "./ambient_accordion";
import SoundEffectList from "./sound_effect/sound_effect_list";
import OstList from "./soundtrack/ost_list";
import EffectSetsList from "./effect_sets/effect_sets_list";

export default function ElementsPane() {
    const { campaign, selectedScene } = useAppProps();

    if (!campaign) {
        return <></>;
    }

    return <div>
        <EffectSetsList title="Campaign FX"/>
        <AmbientAccordion title="Campaign OST">
            <OstList />
        </AmbientAccordion>
        <SoundEffectList title="Campaign SFX" />
        <ImageList title="Campaign Images" />
        { selectedScene && <ImageList title="Scene Images" scene={selectedScene} /> }
    </div>
}