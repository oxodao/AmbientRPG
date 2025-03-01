import { IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import { Element } from "../../sdk/responses/element";

type Props = {
    element: Element;
    hideElement: (element: Element) => Promise<void>;
};

export default function DisplayedElement({ element, hideElement }: Props) {
    return <ListItem>
        <ListItem
            key={element.iri}
            secondaryAction={
                <IconButton edge="end" onClick={() => hideElement(element)}>
                    <IconX size={18} />
                </IconButton>
            }
        >
            <ListItemButton>
                <ListItemText primary={element.name} sx={{my: 0}} />
            </ListItemButton>
        </ListItem>
    </ListItem>
}