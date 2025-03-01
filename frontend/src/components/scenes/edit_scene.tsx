import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Scene from "../../sdk/responses/scene";
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";

type Props = {
    scene: Scene | null;
    close: () => void;
};

export default function EditSceneModal({ scene, close }: Props) {
    const {sdk} = useAppProps();

    return <Dialog
        open={!!scene}
        onClose={close}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (!scene) {
                        return;
                    }

                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());

                    const name = formJson.name;
                    try {
                        await sdk.scenes.update(scene?.id, {name});
                        enqueueSnackbar({
                            message: 'Scène modifiée',
                            variant: 'success',
                        });

                        close();
                   } catch (e) {
                        enqueueSnackbar({
                            message: 'Échec de la modification de la scène',
                            variant: 'error',
                        });

                        console.error(e);
                   }
                },
            },
        }}
    >
        <DialogContent>
            <DialogTitle>Modification de {scene?.name}</DialogTitle>
            <TextField
                autoFocus
                required
                fullWidth
                name="name"
                margin="dense"
                label="Name"
                variant="standard"
                defaultValue={scene?.name ?? ''}
            />
        </DialogContent>

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="success">Save</Button>
        </DialogActions>
    </Dialog>
}