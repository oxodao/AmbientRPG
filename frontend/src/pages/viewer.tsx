import { useAsyncEffect } from "ahooks";
import { useEffect, useState } from "react";

import Image from '../sdk/responses/image';

import { useAppProps } from "../context";
import Character from "../sdk/responses/character";
import PlayerDisplayList from "../components/viewer/PlayerDisplayList";

export default function ViewerPage({ theme }: { theme: string }) {
    const { sdk, campaign, backgroundDuration, loadedImages } = useAppProps();
    const [backgrounds, setBackgrounds] = useState<Image[]>([]);

    const [currentBgImage, setCurrentBgImage] = useState<number>(0);

    const [players, setPlayers] = useState<Character[]>([]);

    useAsyncEffect(async () => {
        if (!campaign) {
            setBackgrounds([]);
            setPlayers([]);
            setCurrentBgImage(0);

            return;
        }

        setBackgrounds([...campaign.images.filter(x => x.background)]);
        setCurrentBgImage(0);

        const campaignPlayers = await sdk.characters.getCollection(
            '',
            campaign,
            undefined,
            false,
        );

        if (campaignPlayers) {
            setPlayers(campaignPlayers.items);
        }
    }, [campaign]);

    useEffect(() => {
        if (backgrounds.length < 1) {
            return;
        }

        if (backgrounds.length === 1) {
            setCurrentBgImage(0);

            return;
        }

        const timer = setInterval(() => {
            setCurrentBgImage(oldBg => (oldBg + 1) % backgrounds.length);
        }, backgroundDuration * 1000);

        return () => clearInterval(timer);
    }, [backgrounds, backgroundDuration]);

    return <div className={`fullsize viewer ${theme}`}>
        {!campaign && <h1>En attente du MJ...</h1>}

        {
            (campaign && backgrounds.length > 0)
            && <img
                className="bgImage"
                src={backgrounds[currentBgImage].url}
                alt="background image"
            />
        }

        {
            Object.values(loadedImages).length > 0
            && <div className="displayedImages">
                {
                    ...Object
                        .values(loadedImages)
                        .map(x => <img
                            src={x.url}
                            alt={x.name}
                            key={x.iri}
                        />)
                }
            </div>
        }

        <PlayerDisplayList characters={players} />
    </div>
}