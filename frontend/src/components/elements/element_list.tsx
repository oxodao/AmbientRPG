import { Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import { useAsyncEffect } from "ahooks";
import { ReactNode, useState } from "react";
import { useAppProps } from "../../context";
import { IconPlus } from "@tabler/icons-react";
import { Element } from "../../sdk/responses/element";

type Props = {
    emptyText: string;
    fetchElements: (search: string) => Promise<Element[]>;
    showSearch?: boolean;
    onClick: (elt: Element) => void;
    secondaryAction?: (image: any) => ReactNode;
    onClickCreate?: () => void;
    icon?: (e: Element) => ReactNode | null;
};

function ListIcon({ iconMethod, element }: { iconMethod: null | ((e: Element) => ReactNode | null), element: Element }) {
    if (!iconMethod) {
        return null;
    }

    return <ListItemIcon>
        {iconMethod(element)}
    </ListItemIcon>;
}

export default function ElementList({
    fetchElements,
    emptyText,
    showSearch,
    onClick,
    secondaryAction,
    onClickCreate,
    icon,
}: Props) {
    const { campaign, selectedScene, editorMode } = useAppProps();
    const [elements, setElements] = useState<Element[]>([]);
    const [search, setSearch] = useState<string>('');

    useAsyncEffect(
        async () => setElements(await fetchElements(search)),
        [
            search,
            selectedScene,
            editorMode, // Toggleing editorMode will change the filter on isBackground
            campaign, // When an element is edited, the campaign is refreshed, thus we need to refresh the list
        ],
    );

    return <div className="elementList">
        {
            (showSearch === undefined || showSearch)
            && <div className="createField" style={{ padding: 0 }}>
                <TextField
                    value={search}
                    onChange={x => setSearch(x.target.value)}
                    placeholder="Rechercher..."
                    size="small"
                />
                {
                    editorMode
                    && <IconButton onClick={onClickCreate}>
                        <IconPlus size={18} />
                    </IconButton>
                }
            </div>
        }
        {
            (showSearch === false && editorMode)
            && <Button onClick={onClickCreate}>Créer</Button>
        }
        <List className="list">
            {elements.length === 0 && <Typography align="center" mt={3}>{emptyText}</Typography>}

            {
                elements.length > 0
                && <List>
                    {
                        elements.map(x =>
                            <ListItem key={x.iri} secondaryAction={secondaryAction ? secondaryAction(x) : <></>}>
                                <ListIcon iconMethod={icon ?? null} element={x} />

                                <ListItemButton onClick={() => onClick(x)}>
                                    <ListItemText primary={x.name} sx={{my: 0}} />
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                </List>
            }
        </List>
    </div>;
}