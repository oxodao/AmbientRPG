import { DockviewApi } from "dockview-core";
import { useAppProps } from "../context"
import TextEditor from "./text_editor";

export default function NotesEditor({dockApi}: {dockApi: DockviewApi}) {
    const {campaign, selectedScene, sdk} = useAppProps();
    const editingScene = !!selectedScene;

    const originalText = editingScene ? (selectedScene.notes ?? '') : (campaign?.notes ?? '');

    return <TextEditor
        text={originalText}
        cleanTitle="Notes"
        dirtyTitle="Notes (*)"
        panel={dockApi.getPanel('notes')}
        onSave={async (newValue: string) => {
            if (editingScene) {
                await sdk.scenes.update(selectedScene.id, {notes: newValue});
            } else if (campaign) {
                await sdk.campaigns.update(campaign.id, {notes: newValue});
            } else {
                throw new Error('NO CAMPAIGN SET. THIS SHOULD NOT HAPPEN!')
            }
        }}
    />
}