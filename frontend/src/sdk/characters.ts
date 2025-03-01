import SDK from ".";
import Campaign from "./responses/campaign";
import Character from "./responses/character";
import { Collection } from "./responses/collection";
import Scene from "./responses/scene";

export default class Characters {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/characters/${id}`);
        const data = await resp.json();

        return Character.fromJson(data);
    }

    public async getFromIri(iri: string) {
        const resp = await this.sdk.get(iri);
        const data = await resp.json();

        return Character.fromJson(data);
    }

    public async getCollection(search?: string, campaign?: Campaign, scene?: Scene, npc?: boolean) {
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

        if (npc !== undefined) {
            sp.append('npc', `${npc}`)
        }

        const resp = await this.sdk.get('/characters?' + sp.toString());
        const data = await resp.json();

        return Collection.fromJson(data, x => Character.fromJson(x));
    }

    public async create(data: Record<string, any>) {
        const resp = await this.sdk.post(
            `/characters`,
            data,
        );

        return Character.fromJson(await resp.json());
    }

    public async update(id: number, data: Record<string, any>) {
        const resp = await this.sdk.patch(`/characters/${id}`, data);

        return Character.fromJson(await resp.json());
    }

    public async delete(id: number) {
        await this.sdk.delete(`/characters/${id}`);
    }
}