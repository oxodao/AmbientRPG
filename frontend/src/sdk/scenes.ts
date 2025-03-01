import SDK from ".";
import Scene from "./responses/scene";
import { Collection } from "./responses/collection";
import Campaign from "./responses/campaign";

export default class Scenes {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/scenes/${id}`);
        const data = await resp.json();

        return Scene.fromJson(data);
    }

    public async getCollection() {
        const resp = await this.sdk.get('/scenes');
        const data = await resp.json();

        return Collection.fromJson(data, x => Scene.fromJson(x));
    }
    
    public async create(name: string, campaign: Campaign) {
        const resp = await this.sdk.post('/scenes', {
            name,
            campaign: campaign.iri,
        });

        return Scene.fromJson(resp);
    }
    
    public async update(id: number, data: Record<string, any>) {
        const resp = await this.sdk.patch(
            `/scenes/${id}`,
            data,
        );

        return Scene.fromJson(await resp.json());
    }

    public async delete(id: number) {
        await this.sdk.delete(`/scenes/${id}`);
    }
}