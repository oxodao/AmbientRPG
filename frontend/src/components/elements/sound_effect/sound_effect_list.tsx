import { useState } from "react";
import ElementList from "../element_list";
import AmbientAccordion from "../ambient_accordion";
import { useAppProps } from "../../../context";
import Scene from "../../../sdk/responses/scene";
import ElementContext from "../element_context";
import { Element } from "../../../sdk/responses/element";
import CreateSoundEffectModal from "./create_sound_effect";
import DeleteSoundEffectModal from "./delete_sound_effect";
import EditSoundEffectModal from "./edit_sound_effect";
import SoundEffect from "../../../sdk/responses/sound_effect";
import { IconRestore, IconVolume2 } from "@tabler/icons-react";

type Props = {
    title: string;
    scene?: Scene;
};

export default function SoundEffectList({ title, scene }: Props) {
    const { sdk, displayedSoundEffects, campaign, sendState } = useAppProps();

    const [isCreatingSfx, setCreatingSfx] = useState<boolean>(false);
    const [editedSfx, setEditedSfx] = useState<Element | null>(null);
    const [removedSfx, setRemovedSfx] = useState<Element | null>(null);

    const displaySfx = async (sfxIri: string) => {
        // Note: this should be an array not a fucking
        // object but the serializer sucks for no reason
        const iris = Object.values(displayedSoundEffects);
        if (iris.includes(sfxIri)) {
            console.log("SFX already opened")
            return;
        }

        await sendState({displayedSoundEffects: [...iris, sfxIri]});
    }

    const hideSfx = async (sfxIri: string) => {
        const iris = Object.values(displayedSoundEffects);
        if (!iris.includes(sfxIri)) {
            console.log("SFX not opened")

            return;
        }

        await sendState({displayedSoundEffects: iris.filter(x => x !== sfxIri)});
    };

    return <>
        <AmbientAccordion title={title}>
            <ElementList
                emptyText={"Aucun effet sonore"}
                fetchElements={async (query: string) => {
                    const data = await sdk.soundEffects.getCollection(
                        query,
                        scene ? undefined : (campaign ?? undefined), // Cursed but meh
                        scene,
                    );

                    if (!data) {
                        return [];
                    }

                    return data.items || [];
                }}
                onClick={x => displaySfx(x.iri)}
                secondaryAction={x => <ElementContext
                    displayed={displayedSoundEffects}
                    element={x}
                    hideElement={hideSfx}
                    setEditedElement={setEditedSfx}
                    setRemovedElement={setRemovedSfx}
                />}
                onClickCreate={() => setCreatingSfx(true)}
                icon={elt => {
                    const fx = elt as SoundEffect;

                    if (fx.loop) {
                        return <IconRestore size={18} />
                    }

                    return <IconVolume2 size={18} />
                }}
            />
        </AmbientAccordion>

        {isCreatingSfx && <CreateSoundEffectModal scene={scene ?? null} close={() => setCreatingSfx(false)} />}
        {editedSfx && <EditSoundEffectModal soundEffect={editedSfx as SoundEffect} close={() => setEditedSfx(null)} />}
        {removedSfx && <DeleteSoundEffectModal soundEffect={removedSfx as SoundEffect} close={() => setRemovedSfx(null)} />}
    </>
}