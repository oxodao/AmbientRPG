import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { useAppProps } from "../../../context";
import Image from "../../../sdk/responses/image";
import { enqueueSnackbar } from "notistack";

type Props = {
    image: Image | null;
    close: () => void;
};

export default function EditImageModal({ image, close }: Props) {
    const { sdk } = useAppProps();

    return <Dialog
        open={!!image}
        onClose={close}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    if (!image) {
                        return;
                    }

                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());


                    const name = formJson.name;
                    const background = formJson.background === 'on';

                    try {
                        await sdk.images.update(image.id, {
                            name,
                            background,
                        });

                        enqueueSnackbar({
                            message: 'Image modifiée',
                            variant: 'success',
                        });

                        close();
                    } catch (e) {
                        enqueueSnackbar({
                            message: 'Échec de la modification de l\'image',
                            variant: 'error',
                        });

                        console.error(e);
                    }
                },
            },
        }}
    >
        <DialogContent>
            <DialogTitle>Modification de {image?.name}</DialogTitle>
            <Stack gap={2} alignItems="center">
                <TextField
                    autoFocus
                    required
                    fullWidth
                    name="name"
                    margin="dense"
                    label="Name"
                    variant="standard"
                    defaultValue={image?.name ?? ''}
                />

                <FormControlLabel
                    control={
                        <Switch
                            defaultChecked={image?.background}
                            name="background"
                        />
                    }
                    color="#2dffff"
                    label="Is background?"
                    labelPlacement="start"
                />
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" color="success">Save</Button>
        </DialogActions>
    </Dialog>
}