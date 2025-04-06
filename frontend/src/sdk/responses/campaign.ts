import Character from "./character";
import EffectSet from "./effect_set";
import Image from "./image";
import Scene from "./scene";
import SoundEffect from "./sound_effect";
import Soundtrack from "./soundtrack";

/**
 * Maybe listing everything is not useful as those are fetched from
 * the search query
 */

export type GameType = 'cyberpunk' | 'fallout' | 'dnd' | 'generic';

export default class Campaign {
    public iri: string;

    public id: number;
    public name: string;
    public gameType: GameType;
    public notes: string;

    public images: Image[];
    public scenes: Scene[];
    public soundEffects: SoundEffect[];
    public soundtracks: Soundtrack[];
    public characters: Character[];
    public effectSets: EffectSet[];

    constructor(data: Record<string, any>) {
        this.id = data['id'];
        this.iri = data['@id'] ?? `/api/campaigns/${this.id}`;
        this.name = data['name'];
        this.notes = data['notes'];
        this.gameType = data['gameType'];

        this.images = [];
        if (Object.keys(data).includes('images')) {
            this.images = data['images']
                .map((x: Record<string, any>) => Image.fromJson(x))
                .filter((x: Image | null) => !!x)
                ;
        }

        this.scenes = [];
        if (Object.keys(data).includes('scenes')) {
            this.scenes = data['scenes']
                .map((x: Record<string, any>) => Scene.fromJson(x))
                .filter((x: Scene | null) => !!x)
                ;
        }

        this.soundEffects = [];
        if (Object.keys(data).includes('soundEffects')) {
            this.soundEffects = data['soundEffects']
                .map((x: Record<string, any>) => SoundEffect.fromJson(x))
                .filter((x: SoundEffect | null) => !!x)
                ;
        }

        this.soundtracks = [];
        if (Object.keys(data).includes('soundtracks')) {
            this.soundtracks = data['soundtracks']
                .map((x: Record<string, any>) => Soundtrack.fromJson(x))
                .filter((x: Soundtrack | null) => !!x)
                ;
        }

        this.characters = [];
        if (Object.keys(data).includes('characters')) {
            this.characters = data['characters']
                .map((x: Record<string, any>) => Character.fromJson(x))
                .filter((x: Character | null) => !!x)
                ;
        }

        this.effectSets = [];
        if (Object.keys(data).includes('effectSets')) {
            this.effectSets = data['effectSets']
                .map((x: Record<string, any>) => EffectSet.fromJson(x))
                .filter((x: EffectSet | null) => !!x)
                ;
        }
    }

    public updateScene(newScene: Scene) {
        const index = this.scenes.findIndex(scene => scene.iri === newScene.iri);
        
        if (index === -1) {
            throw new Error(`Scene with IRI ${newScene.iri} not found`);
        }
        
        this.scenes[index] = newScene;
    }

    public static fromJson(data: Record<string, any> | null): Campaign | null {
        if (!data) {
            return null;
        }

        return new Campaign(data);
    }
}