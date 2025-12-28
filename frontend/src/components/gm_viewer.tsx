import { DockviewApi, DockviewDefaultTab, DockviewReact, DockviewReadyEvent, IDockviewPanelHeaderProps, IDockviewPanelProps } from "dockview-react";
import CampaignSceneList from "./scene_list";
import ElementList from "./elements/elements_pane";
import DisplayElementsPane from "./displayed_elements/displayed_elements";
import Characters from "./characters";
import CharacterViewer from "./character_viewer";
import NotesEditor from "./notes_editor";
import CmdPalette from "./command_palette";
import { useState } from "react";
import { Calculator } from "react-mac-calculator";
import Initiative from "./tool/initiative";

const CustomTab = (props: IDockviewPanelHeaderProps) => <DockviewDefaultTab
    onContextMenu={e => e.preventDefault()}
    hideClose={true}
    {...props}
/>;

export default function GmViewer() {
    const [dockApi, setDockApi] = useState<DockviewApi|null>(null);

    const onReady = (event: DockviewReadyEvent) => {
        setDockApi(event.api);

        event.api.onDidDrop(e => {
            console.log(e.position);
        });

        const notesPanel = event.api.addPanel({
            id: 'notes',
            title: 'Notes',
            component: 'textEditor',
            tabComponent: 'default',
        });

        const scenesPanel = event.api.addPanel({
            id: 'scenes',
            title: 'Scènes',
            component: 'sceneList',
            position: {
                referencePanel: notesPanel,
                direction: 'left',
            },
            initialWidth: 300,
            tabComponent: 'default',
        });

        event.api.addPanel({
            id: 'characters',
            title: 'Personnages',
            component: 'characters',
            position: { referencePanel: scenesPanel },
            inactive: true,
            tabComponent: 'default',
        });

        const elementsPane = event.api.addPanel({
            id: 'elements',
            title: 'Éléments',
            component: 'elements',
            position: {
                referencePanel: notesPanel,
                direction: 'right',
            },
            initialWidth: 300,
            tabComponent: 'default',
            renderer: 'always',
        });

        event.api.addPanel({
            id: 'displayedElements',
            title: 'Affichés',
            component: 'displayedElements',
            position: { referencePanel: elementsPane },
            inactive: true,
            tabComponent: 'default',
        });
    };

    return <>
        { dockApi && <CmdPalette dockApi={dockApi} /> }

        <DockviewReact
            className="dockview-theme-abyss"
            onReady={onReady}
            tabComponents={{ default: CustomTab }}
            components={{
                default: (props: IDockviewPanelProps) => <div>{props.api.title}</div>,
                sceneList: () => <CampaignSceneList />,
                textEditor: (props: IDockviewPanelProps) => <NotesEditor dockApi={props.containerApi} />,
                elements: () => <ElementList />,
                displayedElements: () => <DisplayElementsPane />,
                characters: (props: IDockviewPanelProps) => <Characters dockProps={props} />,
                character_viewer: (props: IDockviewPanelProps) => <CharacterViewer {...props.params} />,
                calculator: () => <Calculator />,
                initiative: () => <Initiative />
            }}
        />

    </>
}