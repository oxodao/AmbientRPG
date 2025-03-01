import Campaigns from "./campaigns";
import Characters from "./characters";
import EffectSets from "./effect_sets";
import Images from "./images";
import { SdkError } from "./responses/error";
import ValidationError, { ValidationErrors } from "./responses/validation_error";
import Scenes from "./scenes";
import SoundEffects from "./sound_effects";
import Soundtracks from "./soundtracks";
import StateSdk from "./state";

export default class SDK {
    private baseUrl: string;

    public state: StateSdk;
    public campaigns: Campaigns;
    public scenes: Scenes;
    public images: Images;
    public soundEffects: SoundEffects;
    public characters: Characters;
    public soundtracks: Soundtracks;
    public effectSets: EffectSets;

    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

        this.state = new StateSdk(this);
        this.campaigns = new Campaigns(this);
        this.scenes = new Scenes(this);
        this.images = new Images(this);
        this.soundEffects = new SoundEffects(this);
        this.characters = new Characters(this);
        this.soundtracks = new Soundtracks(this);
        this.effectSets = new EffectSets(this);
    }

    async request(url: string, init?: RequestInit) {
        if (url.startsWith('/api')) {
            url = this.baseUrl + url.substring(4);
        } else if (url.startsWith('/')) {
            url = this.baseUrl + url;
        }

        if (!init) {
            init = {
                headers: {},
            };
        } else if (!init.headers) {
            init.headers = {};
        }

        try {
            const resp = await fetch(url, init);

            if (this.isHttpError(resp)) {
                let body: any = await resp.text();
                try {
                    body = JSON.parse(body);
                    if (body.message) {
                        body = body.message;
                    }
                } catch {
                    /* empty */
                }

                throw new SdkError(resp.status, body);
            }

            return resp;
        } catch (e: any) {
            if (e.status === 422) {
                throw await this.parseValidationErrors(e.message);
            }

            throw e;
        }
    }

    async get(url: string, options?: any) {
        return await this.request(url, options);
    }

    async post(url: string, data?: any, options?: any) {
        if (!options) {
            options = {};
        }

        if (data) {
            if (!options.headers) {
                options.headers = {};
            }

            if (!(data instanceof FormData)) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(data);
            } else {
                // options.headers['Content-Type'] = 'multipart/form-data';
                options.body = data;
            }
        }

        options['method'] = 'POST';
        return await this.request(url, options);
    }

    async patch(url: string, data?: any, options?: any) {
        if (!options) {
            options = { headers: {} };
        }

        if (data) {
            if (!options.headers) {
                options.headers = {};
            }

            options.headers['Content-Type'] = 'application/merge-patch+json';
            options.body = JSON.stringify(data);
        }

        options['method'] = 'PATCH';
        return await this.request(url, options);
    }

    async delete(url: string) {
        return await this.request(url, { method: 'DELETE' });
    }

    async parseValidationErrors(data: any) {
        if (data['@type'] !== 'ConstraintViolationList') {
            return data;
        }

        const errors: any = {};

        data.violations.forEach((x: any) => {
            if (!Object.keys(errors).includes(x.propertyPath)) {
                errors[x.propertyPath] = new ValidationError(
                    x.propertyPath,
                    []
                );
            }

            errors[x.propertyPath].errors.push(x.message);
        });

        return new ValidationErrors(Object.values(errors));
    }

    isHttpError(response: Response): boolean {
        return !(response.status >= 200 && response.status <= 299);
    }
}