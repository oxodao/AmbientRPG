import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";
import Character from "../../sdk/responses/character";

type Props = {
    character: Character | null;
    close: () => void;
    refreshCharacters: () => Promise<void>;
};

export default function DeleteCharacterModal({ character, close, refreshCharacters}: Props) {
    const {sdk} = useAppProps();

    const onDelete = async () => {
        if (!character) {
            return;
        }

        try {
            await sdk.characters.delete(character.id)
            await refreshCharacters();

            enqueueSnackbar({
                message: 'Personnage supprimé',
                variant: 'success',
            })

            close();
        } catch(e) {
            enqueueSnackbar({
                message: 'Echec de la suppression du personnage',
                variant: 'error',
            })
        }
    };

    return <Dialog
        open={!!character}
        onClose={close}
    >
        {
            character
            && <DialogContent>
                <DialogTitle>Suppression de {character.name}</DialogTitle>
                <DialogContentText>
                    Vous allez supprimer ce personnage, êtes-vous sûr ?
                </DialogContentText>
            </DialogContent>
        }

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={onDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}