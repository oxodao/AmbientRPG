import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useAppProps } from "../../../context";
import { enqueueSnackbar } from "notistack";
import Soundtrack from "../../../sdk/responses/soundtrack";

type Props = {
    soundtrack: Soundtrack | null;
    close: () => void;
};

export default function DeleteSoundtrackModal({ soundtrack, close }: Props) {
    const {sdk} = useAppProps();

    const onDelete = async () => {
        if (!soundtrack) {
            return;
        }

        try {
            await sdk.soundtracks.delete(soundtrack.id)
            close();
        } catch(e) {
            enqueueSnackbar({
                message: 'Echec de la suppression de la soundtrack',
                variant: 'error',
            })
        }
    };

    return <Dialog
        open={!!soundtrack}
        onClose={close}
    >
        {
            soundtrack
            && <DialogContent>
                <DialogTitle>Suppression de {soundtrack.name}</DialogTitle>
                <DialogContentText>
                    Vous allez supprimer cette soundtrack, êtes-vous sûr ?
                </DialogContentText>
            </DialogContent>
        }

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={onDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}