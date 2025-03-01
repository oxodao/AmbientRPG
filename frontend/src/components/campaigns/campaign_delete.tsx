import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";
import Campaign from "../../sdk/responses/campaign";

type Props = {
    campaign: Campaign | null;
    close: () => void;
    refreshCampains: () => Promise<void>;
};

export default function DeleteCampaignModal({ campaign, close, refreshCampains}: Props) {
    const {sdk} = useAppProps();

    const onDelete = async () => {
        if (!campaign) {
            return;
        }

        try {
            await sdk.campaigns.delete(campaign.id)
            await refreshCampains();

            enqueueSnackbar({
                message: 'Campagne supprimée',
                variant: 'success',
            })

            close();
        } catch(e) {
            enqueueSnackbar({
                message: 'Echec de la suppression de la campagne',
                variant: 'error',
            })
        }
    };

    return <Dialog
        open={!!campaign}
        onClose={close}
    >
        {
            campaign
            && <DialogContent>
                <DialogTitle>Suppression de {campaign.name}</DialogTitle>
                <DialogContentText>
                    Vous allez supprimer cette campagne, êtes-vous sûr ?
                </DialogContentText>
            </DialogContent>
        }

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={onDelete} color="error">Delete</Button>
        </DialogActions>
    </Dialog>
}