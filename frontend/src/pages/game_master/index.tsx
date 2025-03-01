import { useAppProps } from "../../context";
import { Typography } from "@mui/material";
import GmViewer from "../../components/gm_viewer";

export default function GameMaster() {
    const { campaign } = useAppProps();
    return <>
        {!campaign && <Typography variant="h1">Aucune campagne sélectionnée</Typography>}
        {campaign && <GmViewer />}
    </>
}