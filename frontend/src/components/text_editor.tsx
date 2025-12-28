import { useEffect, useRef, useState, useCallback } from "react";
// import { Editor } from "@monaco-editor/react";
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
  imagePlugin({ imageUploadHandler: async () => '/sample-image.png' }),
  tablePlugin(),
  thematicBreakPlugin(),
  directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
]

export default function TextEditor({text, cleanTitle, dirtyTitle, onSave, panel}: Props) {
    const [notesDirty, setNotesDirty] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const mdxRef = useRef<MDXEditorMethods>(null);

    const [editedText, setEditedText] = useState<string>(text);

    useEffect(() => {
        if (panel) {
            panel.setTitle(notesDirty ? dirtyTitle : cleanTitle)
        }
    }, [notesDirty, dirtyTitle, cleanTitle, panel]);

    useEffect(() => {
        setEditedText(text);
        setNotesDirty(false);
        mdxRef.current?.setMarkdown(text);
    }, [text]);

    const handleSave = useCallback(async () => {
        if (!notesDirty || isSaving) {
            return;
        }

        setIsSaving(true);
        try {
            await onSave(editedText);
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
        } finally {
            setIsSaving(false);
        }
    }, [notesDirty, isSaving, onSave, editedText]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                void handleSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <MDXEditor
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
        <div style={{ padding: '10px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
                onClick={handleSave}
                disabled={!notesDirty || isSaving}
                style={{
                    padding: '8px 16px',
                    backgroundColor: notesDirty && !isSaving ? '#4CAF50' : '#555',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: notesDirty && !isSaving ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    opacity: notesDirty && !isSaving ? 1 : 0.6
                }}
            >
                {isSaving ? 'Saving...' : 'Save (Ctrl+S)'}
            </button>
        </div>
    </div>
}