export default class Soundtrack {
    public iri: string;
    public id: number;
    public name: string;
    public url: string;

    constructor(data: Record<string, any>) {
        this.iri = data['@id'];
        this.id = data['id'];
        this.name = data['name'];
        this.url = data['url'];
    }

    public static fromJson(data: Record<string, any>|null) {
        if (!data) {
            return null;
        }

        return new Soundtrack(data);
    }
}