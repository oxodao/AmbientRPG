import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useAppProps } from "../../../context";
import { enqueueSnackbar } from "notistack";
import Soundtrack from "../../../sdk/responses/soundtrack";

type Props = {
    soundtrack: Soundtrack | null;
    close: () => void;
};

export default function EditSoundtrackModal({ soundtrack, close }: Props) {
    const { sdk } = useAppProps();

    return <Dialog
        open={!!soundtrack}
        onClose={close}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (!soundtrack) {
                        return;
                    }

                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());

                    const name = formJson.name;

                    try {
                        await sdk.soundtracks.update(soundtrack.id, {
                            name,
                        });

                        enqueueSnackbar({
                            message: 'Soundtrack modifiée',
                            variant: 'success',
                        });

                        close();
                    } catch (e) {
                        enqueueSnackbar({
                            message: 'Échec de la modification de la soundtrack',
                            variant: 'error',
                        });

                        console.error(e);
                    }
                },
            },
        }}
    >
        <DialogContent>
            <DialogTitle>Modification de {soundtrack?.name}</DialogTitle>
            <Stack gap={2} alignItems="center">
                <TextField
                    autoFocus
                    required
                    fullWidth
                    name="name"
                    margin="dense"
                    label="Name"
                    variant="standard"
                    defaultValue={soundtrack?.name ?? ''}
                />
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="success">Save</Button>
        </DialogActions>
    </Dialog>
}