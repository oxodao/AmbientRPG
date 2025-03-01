import { Stack } from "@mui/material";
import Character from "../../sdk/responses/character";
import PlayerDisplay from "./PlayerDisplay";

type Props = {
    characters: Character[];
}

export default function PlayerDisplayList({ characters }: Props) {
    return <Stack direction="row" gap={3} className="playerDisplayList">
        {
            ...characters.map((x, idx) => <PlayerDisplay
                key={x.iri}
                cssIdx={idx % 4} // modulo the amount of different styles possible
                character={x}
            />)
        }
    </Stack>
}