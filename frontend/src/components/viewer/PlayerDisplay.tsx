import { Stack, Typography } from "@mui/material";
import Character from "../../sdk/responses/character";

type Props = {
    cssIdx: number;
    character: Character;
};

export default function PlayerDisplay({cssIdx, character}: Props) {
    return <Stack direction="column" gap={0} className={`playerDisplay playerDisplay--${cssIdx}`}>
        { character.name.length > 0 && <Typography>{character.name}</Typography> }
        { character.class.length > 0 && <Typography variant="body2" align="right">{character.class}</Typography> }
        { character.playedBy.length > 0 && <Typography variant="body2" align="right">{character.playedBy}</Typography> }
    </Stack>
}