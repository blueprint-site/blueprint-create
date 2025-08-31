import { useThemeStore } from '@/api/stores/themeStore';
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  InsertImage,
  imagePlugin,
  tablePlugin,
  InsertTable,
  thematicBreakPlugin,
  InsertThematicBreak,
  ListsToggle,
  listsPlugin,
  UndoRedo,
  markdownShortcutPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
} from '@mdxeditor/editor';

const handleImageUpload = () => Promise.resolve('https://picsum.photos/200/300');

interface FullScreenMarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const FullScreenMarkdownEditor = ({
  value,
  onChange,
  placeholder,
}: FullScreenMarkdownEditorProps) => {
  const { isDarkMode } = useThemeStore();
  
  const plugins = [
    headingsPlugin(),
    markdownShortcutPlugin(),
    quotePlugin(),
    tablePlugin(),
    listsPlugin(),
    thematicBreakPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
    codeMirrorPlugin({ 
      codeBlockLanguages: {
        js: 'JavaScript',
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        ts: 'TypeScript',
        tsx: 'TypeScript JSX',
        jsx: 'JavaScript JSX',
        python: 'Python',
        css: 'CSS',
        html: 'HTML',
        json: 'JSON',
        sql: 'SQL',
        bash: 'Bash',
        shell: 'Shell',
      }
    }),
    imagePlugin({
      imageUploadHandler: handleImageUpload,
    }),
    toolbarPlugin({
      toolbarContents: () => (
        <>
          <BlockTypeSelect />
          <BoldItalicUnderlineToggles />
          <CreateLink />
          <CodeToggle />
          <ListsToggle />
          <InsertThematicBreak />
          <InsertCodeBlock />
          <InsertTable />
          <InsertImage />
          <UndoRedo />
        </>
      ),
    }),
  ];

  return (
    <div className='h-full flex flex-col'>
      <MDXEditor
        className={`${isDarkMode ? 'dark-theme' : ''} flex-1 flex flex-col min-h-0`}
        markdown={value || ''}
        onChange={onChange}
        plugins={plugins}
        placeholder={placeholder || 'Start writing your blog post...'}
        contentEditableClassName='prose prose-base max-w-none px-6 py-4 focus-visible:outline-none'
      />
      <style>{`
        .mdxeditor {
          height: 100% !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .mdxeditor-toolbar {
          flex-shrink: 0;
          border-bottom: 1px solid hsl(var(--border));
          padding: 0.5rem;
          background: hsl(var(--background));
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .mdxeditor-editor-wrapper {
          flex: 1 1 auto !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          min-height: 0 !important;
          height: 100% !important;
        }
        .mdxeditor-editor-container {
          height: 100% !important;
          margin: 0 !important;
        }
        .mdxeditor-root-contenteditable {
          min-height: 100% !important;
          padding: 2rem 3rem !important;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }
        .mdxeditor-root-contenteditable:focus {
          outline: none;
        }
        .mdxeditor-root-contenteditable[contenteditable="true"]:empty:before {
          content: attr(placeholder);
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }
        .cm-editor {
          height: 100% !important;
        }
        .cm-scroller {
          padding: 2rem 3rem !important;
          font-family: inherit;
        }
        .cm-content {
          max-width: 900px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};