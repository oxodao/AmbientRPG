import SDK from ".";
import Campaign from "./responses/campaign";
import { Collection } from "./responses/collection";
import Scene from "./responses/scene";
import SoundEffect from "./responses/sound_effect";

export default class SoundEffects {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/sound_effects/${id}`);
        const data = await resp.json();

        return SoundEffect.fromJson(data);
    }

    public async getFromIri(iri: string) {
        const resp = await this.sdk.get(iri);
        const data = await resp.json();

        return SoundEffect.fromJson(data);
    }

    public async getCollection(search?: string, campaign?: Campaign, scene?: Scene) {
        const sp = new URLSearchParams();
        if (search && search.length > 0) {
            sp.append('searchableName', search);
        }

        if (campaign) {
            sp.append('campaign', campaign.iri);
        } else {
            sp.append('exists[campaign]', 'false');
        }

        if (scene) {
            sp.append('scene', scene.iri);
        } else {
            sp.append('exists[scene]', 'false');
        }

        const resp = await this.sdk.get('/sound_effects?' + sp.toString());
        const data = await resp.json();

        return Collection.fromJson(data, x => SoundEffect.fromJson(x));
    }

    public async create(data: FormData) {
        const resp = await this.sdk.post(
            '/sound_effects',
            data,
        );

        return SoundEffect.fromJson(await resp.json());
    }

    public async update(id: number, data: Record<string, any>) {
        const resp = await this.sdk.patch(`/sound_effects/${id}`, data);

        return SoundEffect.fromJson(await resp.json());
    }

    public async delete(id: number) {
        await this.sdk.delete(`/sound_effects/${id}`);
    }
}