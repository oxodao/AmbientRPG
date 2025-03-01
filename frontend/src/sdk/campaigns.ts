import SDK from ".";
import Campaign from "./responses/campaign";
import { Collection } from "./responses/collection";

export default class Campaigns {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/campaigns/${id}`);
        const data = await resp.json();

        return Campaign.fromJson(data);
    }

    public async getCollection() {
        const resp = await this.sdk.get('/campaigns');
        const data = await resp.json();

        return Collection.fromJson(data, x => Campaign.fromJson(x));
    }

    public async create(data: Record<string, any>) {
        const resp = await this.sdk.post(
            `/campaigns`,
            data,
        );

        return Campaign.fromJson(await resp.json());
    }
    
    public async update(id: number, data: Record<string, any>) {
        const resp = await this.sdk.patch(
            `/campaigns/${id}`,
            data,
        );

        return Campaign.fromJson(await resp.json());
    }

    public async delete(id: number) {
        await this.sdk.delete(`/campaigns/${id}`);
    }
}