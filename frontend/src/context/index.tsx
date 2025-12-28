import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useAsyncEffect } from "ahooks";
import SDK from "../sdk";
import Campaign from "../sdk/responses/campaign";
import State from "../sdk/responses/state";
import Scene from "../sdk/responses/scene";
import Image from "../sdk/responses/image";
import SoundEffect from "../sdk/responses/sound_effect";

type FakeState = {
    campaignIri?: string|null;
    bgDuration?: number;
    displayedImages?: string[];
    displayedSoundEffects?: string[];
    playingSoundtrack?: string|null;
}

type AppProps = {
    sdk: SDK;
    campaign: Campaign | null;
    backgroundDuration: number;
    displayedImages: string[];
    displayedSoundEffects: string[];
    playingSoundtrack: string|null;

    loadedImages: Record<string, Image>;
    loadedSoundEffects: Record<string, SoundEffect>;
    editorMode: boolean;

    selectedScene: Scene | null;
    notesDirty: boolean;
};

type AppContextProps = AppProps & {
    setCurrentCampaign: (campaign: Campaign) => void;
    setAppProps: (props: Record<string, any> | null) => void;
    selectScene: (s: Scene | null) => void;
    sendState: (ns: FakeState) => Promise<void>;
};

const defaultAppProps: AppProps = {
    sdk: new SDK('/api'),
    campaign: null,
    backgroundDuration: 3,
    displayedImages: [],
    displayedSoundEffects: [],
    playingSoundtrack: null,

    editorMode: false,
    loadedImages: {},
    loadedSoundEffects: {},

    selectedScene: null,
    notesDirty: false,
};

const AppContext = createContext<AppContextProps>({
    ...defaultAppProps,
    setCurrentCampaign: () => { },
    setAppProps: () => { },
    selectScene: () => { },
    sendState: async () => {},
});

export default function AppProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppProps>(defaultAppProps);

    const setCurrentCampaign = (campaign: Campaign) => setState({ ...state, campaign });

    const setAppProps = (props: Record<string, any> | null) => {
        if (!props) {
            return;
        }

        setState(oldState => ({
            ...oldState,
            ...props,
        }))
    };

    useEffect(() => {
        const url = new URL(`${window.location.protocol}//${window.location.host}/.well-known/mercure`);
        url.searchParams.append('topic', '/state');
        url.searchParams.append('topic', '/soundtrack');

        if (state.campaign) {
            url.searchParams.append('topic', `/campaigns/${state.campaign.id}`);
        }

        const es = new EventSource(url, { withCredentials: true });

        es.onerror = (e: Event) => {
            const target = e.target as EventSource;

            if (target.readyState === EventSource.CLOSED) {
                console.log('Mercure connection closed...');
                es.close();

                return;
            }

            enqueueSnackbar('Mercure connection lost!', { variant: 'error' });
            setTimeout(() => window.location.reload(), 3000);
        };

        es.addEventListener('/state', x => {
            const data = JSON.parse(x.data);

            const newState = State.fromJson(data);
            if (!newState) {
                return;
            }

            const appliedState = { ...newState };

            // @TODO: debug pourquoi ça pète tout
            // state.campaign est null à ce moment la
            // ce qui fait toujours passer dans le if

            /*
            if (appliedState.campaign?.iri !== state.campaign?.iri) {
                appliedState.selectedScene = null;
            }*/

            setAppProps(appliedState);
        });

        if (state.campaign) {
            es.addEventListener(`/campaigns/${state.campaign.id}`, x => {
                const data = JSON.parse(x.data);
                const campaign = Campaign.fromJson(data);

                setAppProps({campaign});
            });
        }

        return () => {
            es.close();
        };
    }, [state.campaign]);

    useAsyncEffect(async () => setAppProps(await state.sdk.state.get()), []);

    // @TODO: Refactor this crap once the serializer decides to cooperate
    useAsyncEffect(async () => {
        const loadedIris = Object.keys(state.loadedImages);
        const displayedIris  = Object.values(state.displayedImages);

        const imageIris = Object.values(state.displayedImages).filter(x => !loadedIris.includes(x));

        const loadedImages: Record<string, Image> = state.loadedImages;

        for (let i = 0; i < imageIris.length; i++) {
            const img = await state.sdk.images.getFromIri(imageIris[i]);
            if (img) {
                loadedImages[imageIris[i]] = img;
            }
        }

        const toRemoveIris = Object.keys(loadedImages).filter(x => !displayedIris.includes(x));
        toRemoveIris.forEach(element => {
            delete loadedImages[element];
        });

        setAppProps({ loadedImages });
    }, [state.displayedImages]);

    useAsyncEffect(async () => {
        const loadedIris = Object.keys(state.loadedSoundEffects);
        const displayedIris  = Object.values(state.displayedSoundEffects);

        const fxIris = Object.values(state.displayedSoundEffects).filter(x => !loadedIris.includes(x));

        const loadedSoundFx: Record<string, SoundEffect> = state.loadedSoundEffects;

        for (let i = 0; i < fxIris.length; i++) {
            const fx = await state.sdk.soundEffects.getFromIri(fxIris[i]);
            if (fx) {
                loadedSoundFx[fxIris[i]] = fx;
            }
        }

        const toRemoveIris = Object.keys(loadedSoundFx).filter(x => !displayedIris.includes(x));
        toRemoveIris.forEach(element => {
            delete loadedSoundFx[element];
        });

        setAppProps({ loadedSoundEffects: loadedSoundFx });
    }, [state.displayedSoundEffects]);

    const sendState = async (ns: FakeState) => {
        const resp = await state.sdk.state.set(
            ns.campaignIri !== undefined ? ns.campaignIri : (state.campaign?.iri ?? null),
            ns.bgDuration !== undefined ? ns.bgDuration : state.backgroundDuration,
            ns.displayedImages !== undefined ? ns.displayedImages : state.displayedImages,
            ns.displayedSoundEffects !== undefined ? ns.displayedSoundEffects : state.displayedSoundEffects,
            ns.playingSoundtrack !== undefined ? ns.playingSoundtrack : state.playingSoundtrack,
        );

        if (resp) {
            setAppProps(resp);
        }
    };

    return <AppContext.Provider value={{
        ...state,
        setCurrentCampaign,
        setAppProps,
        selectScene: (s: Scene | null) => setAppProps({ selectedScene: s }),
        sendState,
    }}>
        {children}
    </AppContext.Provider>
}

export function useAppProps() {
    return useContext<AppContextProps>(AppContext);
}