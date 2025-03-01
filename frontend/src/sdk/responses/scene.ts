import Image from './image';

export default class Scene {
    public iri: string;
    public id: number;
    public name: string;
    public notes: string;

    public images: Image[];

    public constructor(data: Record<string, any>) {
        this.iri = data['@id'];
        this.id = data['id'];
        this.name = data['name'];
        this.notes = data['notes'];

        this.images = [];
        if (Object.keys(data).includes('images')) {
            this.images = data['images']
                .map((x: Record<string, any>) => Image.fromJson(x))
                .filter((x: Image | null) => !!x)
                ;
        }
    }

    public static fromJson(data: Record<string, any>|null) {
        if (!data) {
            return null;
        }

        return new Scene(data);
    }
}