import { useState } from "react";
import ElementList from "../element_list";
import DeleteImageModal from "./delete_image";
import EditImageModal from "./edit_image";
import Image from "../../../sdk/responses/image";
import AmbientAccordion from "../ambient_accordion";
import { useAppProps } from "../../../context";
import Scene from "../../../sdk/responses/scene";
import ElementContext from "../element_context";
import { Element } from "../../../sdk/responses/element";
import CreateImageModal from "./create_image";
import { IconPhoto } from "@tabler/icons-react";

type Props = {
    title: string;
    scene?: Scene;
};

export default function ImageList({ title, scene }: Props) {
    const { sdk, editorMode, displayedImages, campaign, sendState } = useAppProps();

    const [isCreatingImage, setCreatingImage] = useState<boolean>(false);
    const [editedImage, setEditedImage] = useState<Element | null>(null);
    const [removedImage, setRemovedImage] = useState<Element | null>(null);

    const displayImage = async (imageIri: string) => {
        // Note: this should be an array not a fucking
        // object but the serializer sucks for no reason
        const iris = Object.values(displayedImages);
        if (iris.includes(imageIri)) {
            console.log("Image already opened")
            return;
        }

        await sendState({ displayedImages: [...iris, imageIri] })
    }

    const hideImage = async (imageIri: string) => {
        const iris = Object.values(displayedImages);
        if (!iris.includes(imageIri)) {
            console.log("Image not opened")

            return;
        }

        await sendState({displayedImages: iris.filter(x => x !== imageIri)})
    };

    return <>
        <AmbientAccordion title={title}>
            <ElementList
                emptyText={"Aucune images"}
                fetchElements={async (query: string) => {
                    const data = await sdk.images.getCollection(
                        query,
                        scene ? undefined : (campaign ?? undefined), // Cursed but meh
                        scene,
                        editorMode ? undefined : false,
                    );

                    if (!data) {
                        return [];
                    }

                    return data.items || [];
                }}
                onClick={x => displayImage(x.iri)}
                secondaryAction={x => <ElementContext
                    displayed={displayedImages}
                    element={x}
                    hideElement={hideImage}
                    setEditedElement={setEditedImage}
                    setRemovedElement={setRemovedImage}
                />}
                onClickCreate={() => setCreatingImage(true)}
                icon={() => <IconPhoto size={18} />}
            />
        </AmbientAccordion>

        {isCreatingImage && <CreateImageModal scene={scene ?? null} close={() => setCreatingImage(false)} />}
        {editedImage && <EditImageModal image={editedImage as Image} close={() => setEditedImage(null)} />}
        {removedImage && <DeleteImageModal image={removedImage as Image} close={() => setRemovedImage(null)} />}
    </>
}