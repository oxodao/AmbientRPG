import { useEffect, useRef, useState } from "react";
// import { Editor } from "@monaco-editor/react";
import { useAsyncEffect, useDebounce } from "ahooks";
import { enqueueSnackbar } from "notistack";
import { IDockviewPanel } from "dockview-core";

import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CreateLink,
    InsertAdmonition,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    MDXEditor,
    MDXEditorMethods,
    Separator,
    StrikeThroughSupSubToggles,
    directivesPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor'

/**
 * @TODO: Ajouter des images
 * 
 * @TODO: Peut-être faire un ctrl+s plutôt que autosave
 * @TODO: Steal some stuff there to switch between editor & raw markdown
 * https://github.com/mdx-editor/editor/blob/main/src/plugins/toolbar/components/DiffSourceToggleWrapper.tsx
 */

type Props = {
    text: string;
    cleanTitle: string;
    dirtyTitle: string;
    onSave: (newValue: string) => Promise<void>;
    panel: IDockviewPanel|undefined;
}

const allPlugins = () => [
  toolbarPlugin({ toolbarContents: () => <>
    <BlockTypeSelect />
    <InsertAdmonition />
    <Separator />
    <BoldItalicUnderlineToggles />
    <Separator />
    <StrikeThroughSupSubToggles />
    <Separator />
    <ListsToggle />
    <Separator />
    <CreateLink />
    {
        // @TODO: Implement a server-side generic image storage space
        // So that this works
        /*<InsertImage /> */ 
    }
    <InsertTable />
    <InsertThematicBreak />
  </> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  // eslint-disable-next-line @typescript-eslint/require-await
  imagePlugin({ imageUploadHandler: async () => '/sample-image.png' }),
  tablePlugin(),
  thematicBreakPlugin(),
  // codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
  directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
  // markdownShortcutPlugin(),
]

export default function TextEditor({text, cleanTitle, dirtyTitle, onSave, panel}: Props) {
    const [notesDirty, setNotesDirty] = useState<boolean>(false);

    const mdxRef = useRef<MDXEditorMethods>(null);

    const [editedText, setEditedText] = useState<string>(text);
    const debouncedText = useDebounce(editedText, {wait: 500});

    useEffect(() => {
        if (panel) {
            panel.setTitle(notesDirty ? dirtyTitle : cleanTitle)
        }
    }, [notesDirty]);

    useEffect(() => {
        setEditedText(text);
        setNotesDirty(false);
        mdxRef.current?.setMarkdown(text);
    }, [text]);

    useAsyncEffect(async () => {
        // To skip the first loading / non-dirty notes
        if (debouncedText === text) {
            return;
        }

        try {
            await onSave(debouncedText);
            setNotesDirty(false);
            enqueueSnackbar({
                message: 'Notes sauvegardées',
                variant: 'success',
            });
        } catch (e: any) {
            console.error(e);
            enqueueSnackbar({
                message: 'Echec de la sauvegarde',
                variant: 'error',
            });
        }
    }, [debouncedText]);

    return <MDXEditor
        className="dark-theme dark-editor"
        ref={mdxRef}
        markdown={text}
        onChange={x => {
            setEditedText(x);
            setNotesDirty(x !== text);
        }}
        plugins={allPlugins()}
        contentEditableClassName="fullsizeEditor"
    />
}