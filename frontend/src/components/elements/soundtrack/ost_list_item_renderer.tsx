import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Element } from "../../../sdk/responses/element";
import { useAppProps } from "../../../context";
import { ReactNode } from "react";
import { ListIcon } from "../standard_element_renderer";
import { IconMusic } from "@tabler/icons-react";

type Props = {
    element: Element;
    onClick: (elt: Element) => void;
    secondaryAction?: (image: any) => ReactNode;
}

export default function OstElementRenderer({
    element: x,
    onClick,
    secondaryAction,
}: Props) {
    const {
        editorMode,
        playingSoundtrack,
    } = useAppProps();

    return <ListItem key={x.iri} secondaryAction={secondaryAction ? secondaryAction(x) : <></>}>
        <ListIcon iconMethod={() => <IconMusic size={18} />} element={x} />

        <ListItemButton onClick={() => onClick(x)} disabled={playingSoundtrack === x.iri}>
            <ListItemText
                primary={x.name}
                secondary={editorMode ? x.iri : undefined}
                sx={{ my: 0 }}
            />
        </ListItemButton>
    </ListItem>
}