import { useKeyPress } from "ahooks";
import { useState } from "react";
import CommandPalette, { filterItems, getItemIndex, JsonStructureItem, useHandleOpenCommandPalette } from "react-cmdk";
import { useAppProps } from "../context";

import "react-cmdk/dist/cmdk.css";
import { DockviewApi } from "dockview-core";

export default function CmdPalette({ dockApi }: { dockApi: DockviewApi }) {
    const { campaign } = useAppProps();

    const [page, setPage] = useState<'widget' | 'characters'>('widget');
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    useKeyPress(['ctrl.p'], (evt) => {
        evt.preventDefault();

        setOpen(true);
    });

    useHandleOpenCommandPalette(setOpen);

    let characters: JsonStructureItem[] = [];
    if (campaign) {
        characters = campaign.characters.map(x => ({
            id: 'character_' + x.id,
            children: x.name,
            onClick: () => {
                const characterPanel = 'characters_' + x.iri;

                const panel = dockApi.getPanel(characterPanel);
                if (panel) {
                    panel.focus();
                    return;
                }

                const notesPanel = dockApi.getPanel('notes');
                if (!notesPanel) {
                    return;
                }

                dockApi.addPanel({
                    id: characterPanel,
                    title: x.name,
                    component: 'character_viewer',
                    position: { referencePanel: notesPanel },
                    params: {
                        dockApi: dockApi,
                        panelId: characterPanel,
                        character: x,
                        refreshCharacters: async () => {},
                    }
                })
            }
        }));
    }
    
    // Just so that eslint doesnt kill my whole family
    console.log(setPage, characters);

    const widgets = filterItems([
        {
            heading: 'Widgets',
            id: 'widgets',
            items: [
                {
                    id: 'calculator',
                    children: 'Calculatrice',
                    onClick: () => {
                        dockApi.addPanel({
                            id: 'calculator',
                            component: 'calculator',
                            title: 'Calculatrice',
                            floating: { width: 320, height: 515 },
                            initialWidth: 320,
                            initialHeight: 515,
                            minimumWidth: 320,
                            minimumHeight: 515,
                            maximumWidth: 320,
                            maximumHeight: 515,
                        })
                    }
                },
                {
                    id: 'bestiary',
                    children: 'Bestiaire',
                },
                {
                    id: 'name_generator',
                    children: 'Name generator',
                },
            ]
        },
        /*
        // Problème:
        // On peut pas passer de refreshCharacters donc on va avoir de la vieille
        // data si on clique dessus, c'est de la merde
        // Faut tout faire dans un context pour être safe, à faire plus tard
        {
            id: 'characters',
            heading: 'Personnages',
            items: characters,
        }
            */
    ], search);

    return <CommandPalette
        onChangeOpen={setOpen}
        onChangeSearch={setSearch}
        isOpen={open}
        page={page}
        search={search}
    >
        <CommandPalette.Page id="widget">
            {
                widgets.map((list) => (
                    <CommandPalette.List key={list.id} heading={list.heading}>
                        {list.items.map(({ id, ...rest }) => (
                            <CommandPalette.ListItem
                                key={id}
                                index={getItemIndex(widgets, id)}
                                {...rest}
                            />
                        ))}
                    </CommandPalette.List>
                ))
            }
        </CommandPalette.Page>
    </CommandPalette>
}