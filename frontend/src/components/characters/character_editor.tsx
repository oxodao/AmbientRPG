import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import Campaign from "../../sdk/responses/campaign"
import { useAppProps } from "../../context";
import { enqueueSnackbar } from "notistack";
import Character from "../../sdk/responses/character";
import { useEffect, useState } from "react";

type Props = {
    campaign: Campaign;
    character: Character | null;
    open: boolean;
    close: () => void;
    refreshCharacters: () => Promise<void>;
}

export default function EditCharacterModal({ campaign, character, open, close, refreshCharacters }: Props) {
    const { sdk } = useAppProps();
    const [isNpc, setNpc] = useState<boolean>(false);

    useEffect(() => setNpc(false), [open]);

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

                    formJson.npc = formJson.npc === "true";
                    formJson.campaign = campaign.iri;

                    try {
                        if (character) {
                            await sdk.characters.update(character.id, formJson);
                        } else {
                            await sdk.characters.create(formJson);
                        }

                        enqueueSnackbar({
                            message: 'Personnage ' + (character ? 'modifié' : 'créé'),
                            variant: 'success',
                        });

                        await refreshCharacters();

                        close();
                    } catch (e) {
                        enqueueSnackbar({
                            message: `Échec de la ${character ? 'modification' : 'création'} du personnage`,
                            variant: 'error',
                        });

                        console.error(e);
                    }
                },
            },
        }}
    >
        <DialogContent>
            {character && <DialogTitle>Modification de {character?.name}</DialogTitle>}
            {!character && <DialogTitle>Créer un personange</DialogTitle>}

            <Stack direction="column">
                <TextField
                    autoFocus
                    required
                    fullWidth
                    name="name"
                    margin="dense"
                    label="Name"
                    variant="standard"
                    defaultValue={character?.name ?? ''}
                />

                <TextField
                    required
                    fullWidth
                    name="class"
                    margin="dense"
                    label="Classe"
                    variant="standard"
                    defaultValue={character?.class ?? ''}
                />

                <FormControlLabel
                    control={<Switch
                        name="npc"
                        value={isNpc}
                        onChange={x => setNpc(x.target.checked)}
                    />}
                    label="Est un PNJ?"
                    labelPlacement="start"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0',
                    }}
                />

                {
                    !isNpc
                    && <TextField
                        required
                        fullWidth
                        name="playedBy"
                        margin="dense"
                        label="Joué par"
                        variant="standard"
                        defaultValue={character?.playedBy ?? ''}
                    />
                }
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            {character && <Button type="submit" color="success">Save</Button>}
            {!character && <Button type="submit" color="success">Create</Button>}
        </DialogActions>
    </Dialog>
}