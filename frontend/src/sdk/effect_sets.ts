import SDK from ".";
import Campaign from "./responses/campaign";
import { Collection } from "./responses/collection";
import EffectSet from "./responses/effect_set";

export default class EffectSets {
    private sdk: SDK;

    constructor(sdk: SDK) {
        this.sdk = sdk;
    }

    public async get(id: number) {
        const resp = await this.sdk.get(`/effect_sets/${id}`);
        const data = await resp.json();

        return EffectSet.fromJson(data);
    }

    public async getFromIri(iri: string) {
        const resp = await this.sdk.get(iri);
        const data = await resp.json();

        return EffectSet.fromJson(data);
    }

    public async getCollection(search?: string, campaign?: Campaign) {
        const sp = new URLSearchParams();
        if (search && search.length > 0) {
            sp.append('searchableName', search);
        }

        if (campaign) {
            sp.append('campaign', campaign.iri);
        } else {
            sp.append('exists[campaign]', 'false');
        }

        const resp = await this.sdk.get('/effect_sets?' + sp.toString());
        const data = await resp.json();

        return Collection.fromJson(data, x => EffectSet.fromJson(x));
    }
}