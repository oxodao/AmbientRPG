import SDK from ".";
import State from "./responses/state";

export default class StateSdk {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get() {
        const resp = await this.sdk.get(`/state`);

        return State.fromJson(await resp.json());
    }

    public async set(
        campaignIri: string | null,
        bgDuration: number,
        displayedImages: string[],
        displayedSfx: string[],
        playingSoundtrack: string|null,
    ) {
        const resp = await this.sdk.post('/state', {
            campaign: campaignIri,
            backgroundDuration: bgDuration,
            displayedImages,
            displayedSoundEffects: displayedSfx,
            playingSoundtrack,
        });

        return State.fromJson(await resp.json());
    }

    public async triggerFx(iri: string) {
        await this.sdk.post('/trigger-fx', {
            'effectSet': iri,
        });
    }
}