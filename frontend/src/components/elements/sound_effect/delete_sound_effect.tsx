import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useAppProps } from "../../../context";
import { enqueueSnackbar } from "notistack";
import SoundEffect from "../../../sdk/responses/sound_effect";

type Props = {
    soundEffect: SoundEffect | null;
    close: () => void;
};

export default function DeleteSoundEffectModal({ soundEffect, close }: Props) {
    const {sdk} = useAppProps();

    const onDelete = async () => {
        if (!soundEffect) {
            return;
        }

        try {
            await sdk.soundEffects.delete(soundEffect.id)
            close();
        } catch(e) {
            enqueueSnackbar({
                message: 'Echec de la suppression de l\'effet sonore',
                variant: 'error',
            })
        }
    };

    return <Dialog
        open={!!soundEffect}
        onClose={close}
    >
        {
            soundEffect
            && <DialogContent>
                <DialogTitle>Suppression de {soundEffect.name}</DialogTitle>
                <DialogContentText>
                    Vous allez supprimer cet effet sonore, êtes-vous sûr ?
                </DialogContentText>
            </DialogContent>
        }

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={onDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}