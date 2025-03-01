import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Image from "../../../sdk/responses/image";
import { useAppProps } from "../../../context";
import { enqueueSnackbar } from "notistack";

type Props = {
    image: Image | null;
    close: () => void;
};

export default function DeleteImageModal({ image, close }: Props) {
    const {sdk} = useAppProps();

    const onDelete = async () => {
        if (!image) {
            return;
        }

        try {
            await sdk.images.delete(image.id)
            close();
        } catch(e) {
            enqueueSnackbar({
                message: 'Echec de la suppression de l\'image',
                variant: 'error',
            })
        }
    };

    return <Dialog
        open={!!image}
        onClose={close}
    >
        {
            image
            && <DialogContent>
                <DialogTitle>Suppression de {image.name}</DialogTitle>
                <DialogContentText>
                    Vous allez supprimer cette image, êtes-vous sûr ?
                </DialogContentText>
            </DialogContent>
        }

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={onDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}