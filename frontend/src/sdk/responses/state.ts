import Campaign from "./campaign";

export default class State {
    public campaign: Campaign|null;
    public backgroundDuration: number;
    public displayedImages: string[];
    public displayedSoundEffects: string[];
    public playingSoundtrack: string|null;

    constructor(data: Record<string, any>) {
        this.campaign = Campaign.fromJson(data['campaign']);
        this.backgroundDuration = data['backgroundDuration'];
        this.displayedImages = data['displayedImages'];
        this.displayedSoundEffects = data['displayedSoundEffects'];
        this.playingSoundtrack = data['playingSoundtrack'];
    }

    public static fromJson(data: Record<string, any>|null): State|null {
        if (!data) {
            return null;
        }

        return new State(data);
    }
}