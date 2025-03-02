import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Element } from "../../sdk/responses/element";
import { useAppProps } from "../../context";
import { ReactNode } from "react";

type Props = {
    element: Element;
    onClick: (elt: Element) => void;
    secondaryAction?: (image: any) => ReactNode;
    icon?: (e: Element) => ReactNode | null;
}

type ListIconProps = {
    iconMethod: null | ((e: Element) => ReactNode | null);
    element: Element;
}

export function ListIcon({ iconMethod, element }: ListIconProps) {
    if (!iconMethod) {
        return null;
    }

    return <ListItemIcon>
        {iconMethod(element)}
    </ListItemIcon>;
}

export default function StandardElementRenderer({
    element: x,
    onClick,
    secondaryAction,
    icon,
}: Props) {
    const { editorMode } = useAppProps();

    return <ListItem key={x.iri} secondaryAction={secondaryAction ? secondaryAction(x) : <></>}>
        <ListIcon iconMethod={icon ?? null} element={x} />

        <ListItemButton onClick={() => onClick(x)}>
            <ListItemText
                primary={x.name}
                secondary={editorMode ? x.iri : undefined}
                sx={{ my: 0 }}
            />
        </ListItemButton>
    </ListItem>
}