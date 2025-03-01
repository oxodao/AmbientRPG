import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, styled, Switch, TextField } from "@mui/material";
import { useAppProps } from "../../../context";
import { enqueueSnackbar } from "notistack";
import Scene from "../../../sdk/responses/scene";
import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
    scene: Scene | null;
    close: () => void;
};

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CreateImageModal({ scene, close }: Props) {
    const { sdk, campaign } = useAppProps();
    const [isCreating, setCreating] = useState<boolean>(false);

    const onClose = () => {
        if (isCreating) {
            return;
        }

        close();
    }

    return <Dialog
        open={true}
        onClose={onClose}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();

                    if (!campaign) {
                        return;
                    }

                    const formData = new FormData(event.currentTarget);
                    formData.append('campaign', campaign.iri);

                    if (scene) {
                        formData.append('scene', scene.iri);
                    }

                    formData.set('background', formData.get('background') === 'on' ? 'true' : 'false');

                    setCreating(true);

                    try {
                        await sdk.images.create(formData);

                        enqueueSnackbar({
                            message: 'Image crée',
                            variant: 'success',
                        });

                        setCreating(false);
                        close();
                    } catch (e) {
                        enqueueSnackbar({
                            message: 'Échec de la création de l\'image',
                            variant: 'error',
                        });

                        console.error(e);
                        setCreating(false);
                    }
                },
            },
        }}
    >
        <DialogContent>
            <DialogTitle>Création d'une image</DialogTitle>

            <Stack gap={2} alignItems="center">
                <TextField
                    autoFocus
                    required
                    fullWidth
                    name="name"
                    margin="dense"
                    label="Name"
                    variant="standard"
                />

                <FormControlLabel
                    control={<Switch name="background" />}
                    color="#2dffff"
                    label="Is background?"
                    labelPlacement="start"
                />

                <Button
                    component="label"
                    role={undefined}
                    variant="outlined"
                    tabIndex={-1}
                    startIcon={<IconUpload size={18} />}
                >
                    Select image
                    <VisuallyHiddenInput type="file" name="file" />
                </Button>
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose} disabled={isCreating}>Cancel</Button>
            <Button type="submit" disabled={isCreating} color="error">Create</Button>
        </DialogActions>
    </Dialog>
}