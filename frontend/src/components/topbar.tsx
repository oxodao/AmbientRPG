import { FormControlLabel, IconButton, Switch, Typography } from "@mui/material";
import { useAppProps } from "../context";
import { IconSettings } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Stopwatch from "./stopwatch";

export default function TopBar() {
    const {
        campaign,
        editorMode,
        setAppProps,
    } = useAppProps();

    return <div className="topbar">
        <Link to="/game-master" style={{ textDecoration: 'none' }}>
            <Typography variant="h1">
                {campaign?.name}
                {!campaign && <>Aucune campagne sélectionnée</>}
            </Typography>
        </Link>

        <div className="buttons">
            <Stopwatch />
            <FormControlLabel
                control={
                    <Switch
                        value={editorMode}
                        onChange={x => setAppProps({editorMode: x.target.checked})}
                    />
                }
                color="#2dffff"
                label="Editor mode"
                className="blueGlow"
            />
            <Link to="/game-master/settings">
                <IconButton>
                    <IconSettings />
                </IconButton>
            </Link>
        </div>
    </div>;
}