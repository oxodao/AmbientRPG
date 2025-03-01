import { DockviewApi } from "dockview-core";
import Character from "../sdk/responses/character";
import TextEditor from "./text_editor";
import { useAppProps } from "../context";

type Props = {
    panelId: string;
    character: Character;
    dockApi: DockviewApi;
    refreshCharacters: () => Promise<void>;
};

export default function CharacterViewer({character, panelId, dockApi, refreshCharacters}: Props) {
    const {sdk} = useAppProps();

    return <TextEditor
        text={character.notes ?? ''}
        cleanTitle={character.name}
        dirtyTitle={`${character.name} (*)`}
        panel={dockApi.getPanel(panelId)}
        onSave={async (newValue: string) => {
            await sdk.characters.update(character.id, {notes: newValue});
            await refreshCharacters();
        }}
    />
}