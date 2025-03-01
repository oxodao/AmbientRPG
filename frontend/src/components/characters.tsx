import { useState } from "react"
import Character from "../sdk/responses/character"
import { useAppProps } from "../context";
import { useAsyncEffect } from "ahooks";
import { Button, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { IDockviewPanelProps } from "dockview-core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import EditCharacterModal from "./characters/character_editor";
import DeleteCharacterModal from "./characters/character_delete";

type Props = {
    dockProps: IDockviewPanelProps;
}

export default function Characters({ dockProps }: Props) {
    const { sdk, campaign, selectedScene, editorMode } = useAppProps();
    const [characters, setCharacters] = useState<Character[]>([]);

    const [createdCharacter, setCreatedCharacter] = useState<boolean>(false);
    const [editedCharacter, setEditedCharacter] = useState<Character | null>(null);
    const [deletedCharacter, setDeletedCharacter] = useState<Character | null>(null);

    const refreshCharacters = async () => {
        const chars = await sdk.characters.getCollection('', campaign ?? undefined);

        if (chars) {
            setCharacters(chars.items);
        }
    };

    // @TODO: find a way to list per-scene characters
    useAsyncEffect(refreshCharacters, [campaign, selectedScene]);

    const getSecondary = (x: Character) => {
        let finalStr = [x.npc ? 'PNJ' : 'PJ'];

        if (x.class.length > 0) {
            finalStr.push(x.class);
        }

        if (x.playedBy.length > 0) {
            finalStr.push(x.playedBy);
        }

        return finalStr.join(' - ');
    }

    const onCharacterClick = (x: Character) => {
        const characterPanel = 'characters_' + x.iri;

        const panel = dockProps.containerApi.getPanel(characterPanel);
        if (panel) {
            panel.focus();
            return;
        }

        const notesPanel = dockProps.containerApi.getPanel('notes');
        if (!notesPanel) {
            return;
        }

        dockProps.containerApi.addPanel({
            id: characterPanel,
            title: x.name,
            component: 'character_viewer',
            position: { referencePanel: notesPanel },
            params: {
                dockApi: dockProps.containerApi,
                panelId: characterPanel,
                character: x,
                refreshCharacters,
            }
        });
    };

    return <div className="creatableList">
        <List>
            {
                ...characters.map(x => <ListItem
                    key={x.iri}
                    secondaryAction={editorMode && <div className="inlineIcons">
                        <IconButton onClick={() => setEditedCharacter(x)}>
                            <IconEdit size={18} />
                        </IconButton>
                        <IconButton onClick={() => setDeletedCharacter(x)}>
                            <IconTrash size={18} />
                        </IconButton>
                    </div>}
                >
                    <ListItemButton onClick={() => onCharacterClick(x)}>
                        <ListItemText primary={x.name} secondary={getSecondary(x)} sx={{ my: 0 }} />
                    </ListItemButton>
                </ListItem>)
            }
        </List>
        {
            editorMode
            && <div className="createField">
                <Button onClick={() => setCreatedCharacter(true)} startIcon={<IconPlus size={18} />}>
                    Ajouter
                </Button>
            </div>
        }

        {
            campaign
            && <EditCharacterModal
                campaign={campaign}
                character={editedCharacter}
                open={!!editedCharacter || createdCharacter}
                close={() => {
                    setEditedCharacter(null);
                    setCreatedCharacter(false);
                }}
                refreshCharacters={refreshCharacters}
            />
        }

        <DeleteCharacterModal
            character={deletedCharacter}
            close={() => setDeletedCharacter(null)}
            refreshCharacters={refreshCharacters}
        />
    </div>;
}