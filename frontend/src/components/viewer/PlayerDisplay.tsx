import { Stack, Typography } from "@mui/material";
import Character from "../../sdk/responses/character";

type Props = {
    cssIdx: number;
    character: Character;
};

export default function PlayerDisplay({cssIdx, character}: Props) {
    return <Stack direction="column" gap={0} justifyContent="space-between" className={`playerDisplay playerDisplay--${cssIdx}`}>
        { character.name.length > 0 && <Typography className="character_name">{character.name}</Typography> }
        { character.class.length > 0 && <Typography variant="body2" align="right" className="character_class">{character.class}</Typography> }
        { character.playedBy.length > 0 && <Typography variant="body2" align="right" className="player_name">{character.playedBy}</Typography> }
    </Stack>
}