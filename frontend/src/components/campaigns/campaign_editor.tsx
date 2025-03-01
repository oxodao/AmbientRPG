import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Campaign from "../../sdk/responses/campaign"
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";

type Props = {
    campaign: Campaign | null;
    open: boolean;
    close: () => void;
    refreshCampains: () => Promise<void>;
}

export default function CampaignEditor({ campaign, open, close, refreshCampains }: Props) {
    const { sdk } = useAppProps();

    return <Dialog
        open={open}
        onClose={close}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();

                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());

                    try {
                        if (campaign) {
                            await sdk.campaigns.update(campaign.id, formJson);
                        } else {
                            await sdk.campaigns.create(formJson);
                        }

                        enqueueSnackbar({
                            message: 'Campagne ' + (campaign ? 'modifiée' : 'crée'),
                            variant: 'success',
                        });

                        await refreshCampains();

                        close();
                    } catch (e) {
                        enqueueSnackbar({
                            message: `Échec de la ${campaign ? 'modification' : 'création'} de la campagne`,
                            variant: 'error',
                        });

                        console.error(e);
                    }
                },
            },
        }}
    >
        <DialogContent>
            {campaign && <DialogTitle>Modification de {campaign?.name}</DialogTitle>}
            {!campaign && <DialogTitle>Créer une campagne</DialogTitle>}

            <TextField
                autoFocus
                required
                fullWidth
                name="name"
                margin="dense"
                label="Name"
                variant="standard"
                defaultValue={campaign?.name ?? ''}
            />

        </DialogContent>

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            {campaign && <Button type="submit" color="success">Save</Button>}
            {!campaign && <Button type="submit" color="success">Create</Button>}
        </DialogActions>
    </Dialog>
}