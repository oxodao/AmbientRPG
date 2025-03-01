import { Button, IconButton, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import Campaign from "../../sdk/responses/campaign";
import { useAsyncEffect } from "ahooks";
import { useState } from "react";
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import CampaignEditor from "../../components/campaigns/campaign_editor";
import DeleteCampaignModal from "../../components/campaigns/campaign_delete";

type State = {
    campaigns: Campaign[];
    showEditor: boolean;
    editedCampaign: Campaign | null;
    deletedCampaign: Campaign | null;
}

export default function CampaignsPage() {
    const { sdk } = useAppProps();

    const [state, setState] = useState<State>({
        campaigns: [],
        showEditor: false,
        editedCampaign: null,
        deletedCampaign: null,
    });

    const fetchCampaigns = async () => {
        const resp = await sdk.campaigns.getCollection();

        if (resp) {
            setState(oldState => ({ ...oldState, campaigns: resp.items }));
        } else {
            enqueueSnackbar({
                message: 'Failed to get campaigns',
                variant: 'error',
            });
        }
    };

    useAsyncEffect(fetchCampaigns, []);

    return <Stack alignItems="center" mt={2} gap={2}>
        <Typography variant="h1">Campaigns</Typography>

        <Button
            variant="outlined"
            onClick={() => setState(oldState => ({
                ...oldState,
                editedCampaign: null,
                showEditor: true,
            }))}
        >New</Button>

        <Paper>
            <List>
                {
                    ...state.campaigns.map(x => <ListItem secondaryAction={<Stack direction="row" gap={1}>
                        <IconButton onClick={() => setState(oldState => ({
                            ...oldState,
                            editedCampaign: x,
                            showEditor: true,
                        }))}>
                            <IconEdit size={18} />
                        </IconButton>
                        <IconButton onClick={() => setState(oldState => ({
                            ...oldState,
                            deletedCampaign: x,
                        }))}>
                            <IconTrash size={18} />
                        </IconButton>
                    </Stack>}>
                        <ListItemText primary={x.name} slotProps={{ primary: { paddingRight: 8 } }} sx={{my: 0}} />
                    </ListItem>)
                }
            </List>
        </Paper>

        <CampaignEditor
            campaign={state.editedCampaign}
            open={state.showEditor}
            close={async () => setState(oldState => ({ ...oldState, showEditor: false, editedCampaign: null }))}
            refreshCampains={fetchCampaigns}
        />

        <DeleteCampaignModal
            campaign={state.deletedCampaign}
            close={() => setState(oldState => ({
                ...oldState,
                deletedCampaign: null,
            }))}
            refreshCampains={fetchCampaigns}
        />
    </Stack>
}