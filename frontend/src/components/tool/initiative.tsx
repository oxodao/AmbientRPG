import { IconButton, Input } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useAppProps } from "../../context";
import { useState } from "react";

type data = {
    id: number;
    character: string;
    initiative: number;
}

export default function Initiative() {
    const { campaign } = useAppProps();
    if (!campaign) {
        throw new Error('No campaign selected');
    }

    const [newNpcInput, setNewNpcInput] = useState<string>('');
    const [npcIdx, setNpcIdx] = useState<number>(-1);
    const [characters, setCharacters] = useState<data[]>(campaign.characters.filter(x => !x.npc).map(x => ({
        id: x.id,
        character: x.name,
        initiative: 0,
    })));

    const removeCharacter = (id: number) => {
        setCharacters(characters.filter(x => x.id !== id));
    }

    return <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <DataGrid
            columns={[
                { field: 'actions', headerName: 'Actions', width: 80, renderCell: (params) => <IconButton onClick={() => removeCharacter(params.row.id)}><IconX /></IconButton> },
                { field: 'character', headerName: 'Personnage', width: 200, editable: true },
                { field: 'initiative', headerName: 'Initiative', width: 150, editable: true, type: 'number' }
            ]}
            rows={characters}
            hideFooter
        />

        <div style={{ display: 'flex', gap: '10px', padding: '5px', alignItems: 'center' }}>
            <span style={{ color: "white" }}>New NPC: </span>
            <Input style={{ flex: 1 }} type="text" value={newNpcInput} onChange={x => setNewNpcInput(x.target.value)} />
            <IconButton onClick={() => {
                setCharacters([{
                    id: npcIdx,
                    character: newNpcInput,
                    initiative: 0,
                }, ...characters]);
                setNpcIdx(npcIdx - 1);
                setNewNpcInput('');
            }}><IconPlus /></IconButton>
    </div>
    </div >
}