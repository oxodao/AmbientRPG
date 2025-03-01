import { Button, Card, CardContent, Slider, Stack, Typography } from "@mui/material";
import { useAppProps } from "../../../context";
import { useEffect, useRef, useState } from "react";
import { IconVolume } from "@tabler/icons-react";

/**
 * Crappy ass component but it does the job
 * @TODO: make a fully custom audio player, the native one sucks
 */

export default function OstList() {
    const { campaign, playingSoundtrack, sendState } = useAppProps();
    const [currentSong, setCurrentSong] = useState<string | null>(playingSoundtrack);
    const [songStatuses, setSongStatuses] = useState<Record<string, number>>({});
    const [volume, setVolume] = useState<number>(.2);

    const audioRef = useRef<HTMLAudioElement>(null);

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

    if (campaign?.soundtracks.length === 0) {
        return <Stack>
            <Typography align="center" mt={3}>Aucune soundtrack</Typography>
        </Stack>
    }

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
            campaign && <>
                {
                    ...campaign.soundtracks.map(x => <Button
                        onClick={() => sendState({ playingSoundtrack: x.iri })}
                        disabled={currentSong === x.iri}
                    >
                        {x.name}
                    </Button>)
                }
            </>
        }
    </Stack>
}