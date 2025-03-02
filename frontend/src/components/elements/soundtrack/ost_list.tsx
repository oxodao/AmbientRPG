import { Card, CardContent, Slider, Stack, Typography } from "@mui/material";
import { useAppProps } from "../../../context";
import { useEffect, useRef, useState } from "react";
import { IconVolume } from "@tabler/icons-react";
import ElementList from "../element_list";
import ElementContext from "../element_context";
import Soundtrack from "../../../sdk/responses/soundtrack";
import OstElementRenderer from "./ost_list_item_renderer";
import CreateSoundtrackModal from "./create_soundtrack";
import DeleteSoundtrackModal from "./delete_soundtrack";
import EditSoundtrackModal from "./edit_soundtrack";

/**
 * Crappy ass component but it does the job
 * @TODO: make a fully custom audio player, the native one sucks
 */

export default function OstList() {
    const { campaign, playingSoundtrack, sendState, sdk } = useAppProps();
    const [currentSong, setCurrentSong] = useState<string | null>(playingSoundtrack);
    const [songStatuses, setSongStatuses] = useState<Record<string, number>>({});
    const [volume, setVolume] = useState<number>(.2);

    const [editedSoundtrack, setEditedSoundtrack] = useState<Soundtrack | null>(null);
    const [removedSoundtrack, setRemovedSoundtrack] = useState<Soundtrack | null>(null);
    const [isCreatingSoundtrack, setCreatingSoundtrack] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement>(null);

    const fetchSoundtracks = async () => {
        if (!campaign) {
            return [];
        }

        const data = await sdk.soundtracks.getCollection(campaign);

        if (!data) {
            return [];
        }

        return data.items || [];
    }

    useEffect(() => {
        if (currentSong) {
            setSongStatuses({
                ...songStatuses,
                [currentSong]: audioRef.current?.currentTime ?? 0,
            });
        }

        setCurrentSong(playingSoundtrack);
    }, [playingSoundtrack]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return <Stack direction="column" gap={1}>
        <Card>
            <CardContent>
                <Stack gap={2}>
                    {
                        currentSong
                        && <>
                            <audio
                                controls
                                loop
                                autoPlay
                                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                                // @ts-ignore nique ta race
                                disableRemotePlayback
                                ref={audioRef}
                                src={`${currentSong}/download`}
                                onLoadedData={x => {
                                    x.currentTarget.volume = volume;
                                    x.currentTarget.currentTime = songStatuses[currentSong] ?? 0;
                                }}
                                onPause={x => {
                                    if (!x.currentTarget.seeking) {
                                        sendState({ playingSoundtrack: null })
                                    }
                                }}
                            />

                        </>
                    }

                    <Stack direction="row" gap={2} alignItems="center">
                        <IconVolume />
                        <Slider
                            style={{ flex: 1 }}
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={(_, x) => setVolume(x as number)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={value => `${Math.round(value * 100)}%`}
                        />
                        <Typography>{Math.round(volume * 100)}%</Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>

        {
            campaign
            && <ElementList
                emptyText={"Aucune soundtrack"}
                fetchElements={fetchSoundtracks}
                onClick={x => sendState({ playingSoundtrack: x.iri })}
                secondaryAction={x => <ElementContext
                    displayed={[]}
                    element={x}
                    hideElement={() => { }}
                    setEditedElement={x => setEditedSoundtrack(x as Soundtrack | null)}
                    setRemovedElement={x => setRemovedSoundtrack(x as Soundtrack | null)}
                />}
                onClickCreate={() => setCreatingSoundtrack(true)}
                itemRenderer={(x, onClick, secondaryAction) => <OstElementRenderer
                    element={x}
                    onClick={onClick}
                    secondaryAction={secondaryAction}
                />}
                showSearch={false}
            />
        }

        {isCreatingSoundtrack && <CreateSoundtrackModal close={() => setCreatingSoundtrack(false)} />}
        {removedSoundtrack && <DeleteSoundtrackModal soundtrack={removedSoundtrack} close={() => setRemovedSoundtrack(null)} />}
        {editedSoundtrack && <EditSoundtrackModal soundtrack={editedSoundtrack} close={() => {
            setEditedSoundtrack(null);
            // ??? I dont remember how to tell the list to refresh
        }} />}
    </Stack>
}