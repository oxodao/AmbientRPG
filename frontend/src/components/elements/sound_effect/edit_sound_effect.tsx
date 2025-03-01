import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { useAppProps } from "../../../context";
import { enqueueSnackbar } from "notistack";
import SoundEffect from "../../../sdk/responses/sound_effect";

type Props = {
    soundEffect: SoundEffect | null;
    close: () => void;
};

export default function EditSoundEffectModal({ soundEffect, close }: Props) {
    const { sdk } = useAppProps();

    return <Dialog
        open={!!soundEffect}
        onClose={close}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (!soundEffect) {
                        return;
                    }

                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());

                    const name = formJson.name;
                    const loop = formJson.loop === 'on';

                    try {
                        await sdk.soundEffects.update(soundEffect.id, {
                            name,
                            loop,
                        });

                        enqueueSnackbar({
                            message: 'Effet sonore modifié',
                            variant: 'success',
                        });

                        close();
                    } catch (e) {
                        enqueueSnackbar({
                            message: 'Échec de la modification de l\'effet sonore',
                            variant: 'error',
                        });

                        console.error(e);
                    }
                },
            },
        }}
    >
        <DialogContent>
            <DialogTitle>Modification de {soundEffect?.name}</DialogTitle>
            <Stack gap={2} alignItems="center">
                <TextField
                    autoFocus
                    required
                    fullWidth
                    name="name"
                    margin="dense"
                    label="Name"
                    variant="standard"
                    defaultValue={soundEffect?.name ?? ''}
                />

                <FormControlLabel
                    control={
                        <Switch
                            defaultChecked={soundEffect?.loop}
                            name="loop"
                        />
                    }
                    color="#2dffff"
                    label="Looping?"
                    labelPlacement="start"
                />
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="success">Save</Button>
        </DialogActions>
    </Dialog>
}