import SDK from ".";
import Campaign from "./responses/campaign";
import { Collection } from "./responses/collection";
import Image from "./responses/image";
import Scene from "./responses/scene";

export default class Images {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/images/${id}`);
        const data = await resp.json();

        return Image.fromJson(data);
    }

    public async getFromIri(iri: string) {
        const resp = await this.sdk.get(iri);
        const data = await resp.json();

        return Image.fromJson(data);
    }

    public async getCollection(search?: string, campaign?: Campaign, scene?: Scene, background?: boolean) {
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

        if (background !== undefined) {
            sp.append('background', `${background}`)
        }

        const resp = await this.sdk.get('/images?' + sp.toString());
        const data = await resp.json();

        return Collection.fromJson(data, x => Image.fromJson(x));
    }

    public async create(data: FormData) {
        const resp = await this.sdk.post(
            '/images',
            data,
        );

        return Image.fromJson(await resp.json());
    }

    public async update(id: number, data: Record<string, any>) {
        const resp = await this.sdk.patch(`/images/${id}`, data);

        return Image.fromJson(await resp.json());
    }

    public async delete(id: number) {
        await this.sdk.delete(`/images/${id}`);
    }
}