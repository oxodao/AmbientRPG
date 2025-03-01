import { useState } from "react";
import { useAsyncEffect } from "ahooks";
import { IconButton, Input, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useAppProps } from "../../context";
import Campaign from "../../sdk/responses/campaign";

import '../../assets/gm.scss';
import { IconEdit } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function SettingsPage() {
    const {
        sdk,
        campaign,
        backgroundDuration,
        setAppProps,
    } = useAppProps();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useAsyncEffect(async () => {
        const resp = await sdk.campaigns.getCollection();

        if (!resp) {
            return;
        }

        setCampaigns(resp.items)
    }, []);

    const selectCampaign = async (id: string | null, bgDuration: number) => {
        const campaign = await sdk.state.set(
            (id && id?.length > 0) ? id : null,
            bgDuration,
            [],
            [],
            null,
        );

        setAppProps(campaign);
    };

    return <div className="settingsPage">
        <Typography variant="body1">Campaign:</Typography>
        <Stack direction="row" gap={2} alignItems="center">
            <Select
                labelId="current-campain-select"
                value={campaigns.length > 0 ? (campaign?.iri) || '' : ''}
                onChange={x => selectCampaign(x.target.value, backgroundDuration)}
                displayEmpty
                style={{flex: 1}}
            >
                <MenuItem value="">-- Aucune campagne --</MenuItem>
                {
                    campaigns.map(x => <MenuItem
                        key={x.id}
                        value={x.iri}>
                        {x.name}
                    </MenuItem>)
                }
            </Select>

            <Link to="/game-master/campaigns">
                <IconButton>
                    <IconEdit size={18} />
                </IconButton>
            </Link>
        </Stack>

        <Typography variant="body1">Durée bg:</Typography>
        <Input
            type="number"
            value={backgroundDuration}
            onChange={x => selectCampaign(campaign?.iri ?? null, parseInt(x.target.value))}
        />
    </div>
}