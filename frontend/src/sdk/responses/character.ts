export default class Character {
    public iri: string;
    public id: number;
    public name: string;
    public class: string;
    public playedBy: string;
    public notes: string|null;
    public npc: boolean;

    private constructor(data: Record<string, any>) {
        this.iri = data['@id'];
        this.id = data['id'];
        this.name = data['name'];
        this.class = data['class'];
        this.playedBy = data['playedBy'];
        this.notes = data['notes'] ?? null;
        this.npc = data['npc'];
    }

    public static fromJson(data: Record<string, any>|null) {
        if (!data) {
            return null;
        }

        return new Character(data);
    }
}