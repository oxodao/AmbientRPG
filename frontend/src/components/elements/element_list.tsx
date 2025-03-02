import { Button, IconButton, List, TextField, Typography } from "@mui/material";
import { useAsyncEffect } from "ahooks";
import { ReactNode, useState } from "react";
import { useAppProps } from "../../context";
import { IconPlus } from "@tabler/icons-react";
import { Element } from "../../sdk/responses/element";
import StandardElementRenderer from "./standard_element_renderer";

type Props = {
    emptyText: string;
    fetchElements: (search: string) => Promise<Element[]>;
    showSearch?: boolean;
    onClick: (elt: Element) => void;
    secondaryAction?: (image: any) => ReactNode;
    onClickCreate?: () => void;
    icon?: (e: Element) => ReactNode | null;
    itemRenderer?: (
        element: Element,
        onClick: (elt: Element) => void,
        secondaryAction?: (image: any) => ReactNode,
        icon?: (e: Element) => ReactNode | null,
    ) => ReactNode;
};

export default function ElementList({
    fetchElements,
    emptyText,
    showSearch,
    onClick,
    secondaryAction,
    onClickCreate,
    icon,
    itemRenderer,
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
                        !itemRenderer
                        && elements.map(x =>
                            <StandardElementRenderer
                                element={x}
                                onClick={onClick}
                                secondaryAction={secondaryAction}
                                icon={icon}
                            />
                        )
                    }
                    {
                        itemRenderer
                        && elements.map(x => itemRenderer(x, onClick, secondaryAction, icon))
                    }
                </List>
            }
        </List>
    </div>;
}