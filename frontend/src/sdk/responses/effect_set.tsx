export default class EffectSet {
    public iri: string;
    public id: number;
    public name: string;
    public effect: string;

    public constructor(data: Record<string, any>) {
        this.iri = data['@id'];
        this.id = data['id'];
        this.name = data['name'];
        this.effect = data['effect'];
    }

    public static fromJson(data: Record<string, any>|null) {
        if (!data) {
            return null;
        }

        return new EffectSet(data);
    }
}