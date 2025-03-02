import { IconButton, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import { useAppProps } from "../context";
import { useState } from "react";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import Scene from "../sdk/responses/scene";
import EditSceneModal from "./scenes/edit_scene";
import DeleteSceneModal from "./scenes/delete_scene";

export default function CampaignSceneList() {
    const {
        sdk,
        campaign,
        selectedScene,
        selectScene,
        editorMode,
    } = useAppProps();

    const [editedScene, setEditedScene] = useState<Scene | null>(null);
    const [deletedScene, setDeletedScene] = useState<Scene | null>(null);

    const [createName, setCreateName] = useState<string>('');

    const createScene = async () => {
        if (createName.length === 0 || !campaign) {
            return;
        }

        // @TODO: How to set it properly ?
        // Maybe just rely on Mercure
        await sdk.scenes.create(createName, campaign);
        setCreateName('');
    };

    return <div className="creatableList">
        <List>
            <ListItem key="root">
                <ListItemButton onClick={() => selectScene(null)} selected={!selectedScene}>
                    <ListItemText primary="- Campagne -" sx={{ my: 0 }} />
                </ListItemButton>
            </ListItem>

            {
                campaign?.scenes.map(x => <ListItem
                    key={x.iri}
                    secondaryAction={editorMode && <div className="inlineIcons">
                        <IconButton onClick={() => setEditedScene(x)}>
                            <IconEdit size={18} />
                        </IconButton>
                        <IconButton onClick={() => setDeletedScene(x)}>
                            <IconTrash size={18} />
                        </IconButton>
                    </div>}
                >
                    <ListItemButton
                        onClick={() => selectScene(x)}
                        selected={!!selectedScene && selectedScene.iri === x.iri}
                    >
                        <ListItemText primary={x.name} sx={{ my: 0 }} />
                    </ListItemButton>
                </ListItem>)
            }
        </List>

        {
            editorMode
            && <div className="createField">
                <TextField
                    value={createName}
                    size="small"
                    onChange={x => setCreateName(x.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && createName.length > 0) {
                            createScene();
                        }
                    }}
                />
                <IconButton onClick={createScene} disabled={createName.length === 0}>
                    <IconPlus size={18} />
                </IconButton>
            </div>
        }


        <EditSceneModal scene={editedScene} close={() => setEditedScene(null)} />
        <DeleteSceneModal scene={deletedScene} close={() => setDeletedScene(null)} />
    </div>;
}