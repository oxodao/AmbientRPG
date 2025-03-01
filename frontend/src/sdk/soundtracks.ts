import SDK from ".";
import Campaign from "./responses/campaign";
import { Collection } from "./responses/collection";
import Scene from "./responses/scene";
import Soundtrack from "./responses/soundtrack";

export default class Soundtracks {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/soundtracks/${id}`);
        const data = await resp.json();

        return Soundtrack.fromJson(data);
    }

    public async getFromIri(iri: string) {
        const resp = await this.sdk.get(iri);
        const data = await resp.json();

        return Soundtrack.fromJson(data);
    }

    public async getCollection(campaign?: Campaign, scene?: Scene) {
        const sp = new URLSearchParams();

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

        const resp = await this.sdk.get('/soundtracks?' + sp.toString());
        const data = await resp.json();

        return Collection.fromJson(data, x => Soundtrack.fromJson(x));
    }

    public async create(data: FormData) {
        const resp = await this.sdk.post(
            '/soundtracks',
            data,
        );

        return Soundtrack.fromJson(await resp.json());
    }

    public async update(id: number, data: Record<string, any>) {
        const resp = await this.sdk.patch(`/soundtracks/${id}`, data);

        return Soundtrack.fromJson(await resp.json());
    }

    public async delete(id: number) {
        await this.sdk.delete(`/soundtracks/${id}`);
    }
}