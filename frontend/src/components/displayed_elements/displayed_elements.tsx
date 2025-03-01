import { List, Typography } from "@mui/material";
import { useAppProps } from "../../context";
import DisplayedElement from "./displayed_image";
import { Element } from "../../sdk/responses/element";

/**
 * This only displays the images as this is for the viewer
 * and the sounds are coming from the GM screen
 * 
 * (This should later be configurable so that the game screen can be another device)
 */
export default function DisplayElementsPane() {
    const {
        displayedImages,
        loadedImages,
        displayedSoundEffects,
        loadedSoundEffects,
        sendState,
    } = useAppProps();

    const currentlyDisplayedImages = Object.values(displayedImages).filter(x => Object.keys(loadedImages).includes(x));
    const currentlyDisplayedSoundEffects = Object.values(displayedSoundEffects).filter(x => Object.keys(loadedSoundEffects).includes(x));

    return <List>
        {
            currentlyDisplayedImages.length === 0
            && currentlyDisplayedSoundEffects.length === 0
            && <Typography align="center" mt={3}>Aucun élément affiché</Typography>
        }
        {
            ...currentlyDisplayedImages
                .map(x => <DisplayedElement
                    element={loadedImages[x]}
                    hideElement={async (element: Element) => {
                        const iris = Object.values(displayedImages);
                        if (!iris.includes(element.iri)) {
                            console.log("Image not opened")

                            return;
                        }

                        await sendState({ displayedImages: iris.filter(x => x !== element.iri) })
                    }}
                />)
        }
        {
            ...currentlyDisplayedSoundEffects
                .map(x => <DisplayedElement
                    element={loadedSoundEffects[x]}
                    hideElement={async (element: Element) => {
                        const iris = Object.values(displayedSoundEffects);
                        if (!iris.includes(element.iri)) {
                            console.log("SFX not opened")

                            return;
                        }

                        await sendState({ displayedSoundEffects: iris.filter(x => x !== element.iri) })
                    }}
                />)
        }
    </List>
}