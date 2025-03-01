import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Scene from "../../sdk/responses/scene";
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";

type Props = {
    scene: Scene | null;
    close: () => void;
};

export default function DeleteSceneModal({ scene, close }: Props) {
    const {sdk} = useAppProps();

    const onDelete = async () => {
        if (!scene) {
            return;
        }

        try {
            await sdk.scenes.delete(scene.id)
            close();
        } catch(e) {
            enqueueSnackbar({
                message: 'Echec de la suppression de la scène',
                variant: 'error',
            })
        }
    };

    return <Dialog
        open={!!scene}
        onClose={close}
    >
        {
            scene
            && <DialogContent>
                <DialogTitle>Suppression de {scene.name}</DialogTitle>
                <DialogContentText>
                    Vous allez supprimer cette scène, êtes-vous sûr ?
                </DialogContentText>
            </DialogContent>
        }

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={onDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}