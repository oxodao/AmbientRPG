import { IconButton } from "@mui/material";
import { IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useAppProps } from "../../context";
import { Element } from "../../sdk/responses/element";

type Props = {
    displayed: string[];
    element: Element;

    hideElement: (iri: string) => void;
    setEditedElement: (e: Element) => void;
    setRemovedElement: (e: Element) => void;
};

export default function ElementContext({displayed, element, hideElement, setEditedElement, setRemovedElement}: Props) {
    const {editorMode} = useAppProps();

    return <div className="inlineIcons">
        {
            displayed.includes(element.iri)
            && <IconButton onClick={() => hideElement(element.iri)}>
                <IconX size={18} />
            </IconButton>
        }
        {
            editorMode && <>
                <IconButton onClick={() => setEditedElement(element)}>
                    <IconEdit size={18} />
                </IconButton>
                <IconButton onClick={() => setRemovedElement(element)}>
                    <IconTrash size={18} />
                </IconButton>
            </>
        }
    </div>;
}