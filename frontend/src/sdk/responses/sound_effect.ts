export default class SoundEffect {
    public iri: string;
    public id: number;
    public name: string;
    public loop: boolean;
    public url: string;

    constructor(data: Record<string, any>) {
        this.iri = data['@id'];
        this.id = data['id'];
        this.name = data['name'];
        this.loop = data['loop'];
        this.url = data['url'];
    }

    public static fromJson(data: Record<string, any>|null) {
        if (!data) {
            return null;
        }

        return new SoundEffect(data);
    }
}