export default class Image {
    public iri: string;
    public id: number;
    public name: string;
    public background: boolean;
    public url: string;

    constructor(data: Record<string, any>) {
        this.iri = data['@id'];
        this.id = data['id'];
        this.name = data['name'];
        this.background = data['background'];
        this.url = data['url'];
    }

    public static fromJson(data: Record<string, any>|null) {
        if (!data) {
            return null;
        }

        return new Image(data);
    }
}