import React from 'react'; // Import React for JSX
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  toolbarPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertFrontmatter,
  frontmatterPlugin,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  InsertImage,
  imagePlugin,
  tablePlugin,
  InsertTable,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  thematicBreakPlugin,
  InsertThematicBreak,
  ListsToggle,
  listsPlugin,
  UndoRedo,
  InsertSandpack,
  sandpackPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  SandpackConfig,
  markdownShortcutPlugin,
  quotePlugin,
  RealmPlugin,
} from '@mdxeditor/editor';

// Constants
const DEFAULT_SNIPPET_CONTENT = `
export default function App() {
  return (
    <div>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const HTML_SNIPPET_CONTENT = `
<html lang="en">
  <body>
    <h1>Hello world 🤜</h1>
  </body>
</html>
`.trim();

const SANDPACK_CONFIG: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'auto',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: DEFAULT_SNIPPET_CONTENT,
    },
    {
      label: 'Html',
      name: 'html',
      meta: 'live static',
      sandpackTemplate: 'static',
      sandpackTheme: 'auto',
      snippetFileName: '/index.html',
      snippetLanguage: 'html',
      initialSnippetContent: HTML_SNIPPET_CONTENT,
    },
  ],
};

const CODE_MIRROR_LANGUAGES = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  python: 'Python',
  css: 'CSS',
  html: 'HTML',
};

const handleImageUpload = () => Promise.resolve('https://picsum.photos/200/300');
const IMAGE_SUGGESTIONS = ['https://picsum.photos/200/300', 'https://picsum.photos/200'];

// Helpers
type PluginConfig = {
  condition: boolean;
  createPlugin: () => RealmPlugin;
};

const createPlugins = (configs: PluginConfig[]) =>
  configs.filter(c => c.condition).map(c => c.createPlugin());

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  showCodeBlocks?: boolean;
  showImages?: boolean;
  showTables?: boolean;
  showFrontmatter?: boolean;
  showSandpack?: boolean;
  showDiffSource?: boolean;
  showThematicBreak?: boolean;
  showLists?: boolean;
  showUndoRedo?: boolean;
}

const MarkdownEditor = ({
  value,
  onChange,
  showCodeBlocks = true,
  showImages = true,
  showTables = true,
  showFrontmatter = true,
  showSandpack = true,
  showDiffSource = true,
  showThematicBreak = true,
  showLists = true,
  showUndoRedo = true,
}: MarkdownEditorProps) => {
  // Plugins configuration
  const plugins = createPlugins([
    { condition: true, createPlugin: () => headingsPlugin() },
    { condition: true, createPlugin: () => markdownShortcutPlugin() },
    { condition: true, createPlugin: () => quotePlugin() },
    { condition: showTables, createPlugin: () => tablePlugin() },
    { condition: showLists, createPlugin: () => listsPlugin() },
    { condition: showThematicBreak, createPlugin: () => thematicBreakPlugin() },
    { condition: showFrontmatter, createPlugin: () => frontmatterPlugin() },
    {
      condition: showCodeBlocks,
      createPlugin: () => codeBlockPlugin({ defaultCodeBlockLanguage: 'js' })
    },
    {
      condition: showCodeBlocks,
      createPlugin: () => codeMirrorPlugin({ codeBlockLanguages: CODE_MIRROR_LANGUAGES })
    },
    {
      condition: showSandpack,
      createPlugin: () => sandpackPlugin({ sandpackConfig: SANDPACK_CONFIG })
    },
    {
      condition: showImages,
      createPlugin: () => imagePlugin({
        imageUploadHandler: handleImageUpload,
        imageAutocompleteSuggestions: IMAGE_SUGGESTIONS,
      })
    },
    {
      condition: showDiffSource,
      createPlugin: () => diffSourcePlugin({ diffMarkdown: value })
    },
    {
      condition: true,
      createPlugin: () => toolbarPlugin({
        toolbarContents: () => (
          <>
            <BlockTypeSelect />
            <BoldItalicUnderlineToggles />
            <CreateLink />
            {showCodeBlocks && <CodeToggle />}
            {showLists && <ListsToggle />}
            {showThematicBreak && <InsertThematicBreak />}
            {showCodeBlocks && <InsertCodeBlock />}
            {showTables && <InsertTable />}
            {showFrontmatter && <InsertFrontmatter />}
            {showImages && <InsertImage />}
            {showUndoRedo && <UndoRedo />}
            {showDiffSource && <DiffSourceToggleWrapper children={undefined} />}
            {showCodeBlocks && (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === 'codeblock',
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    when: (editor) => editor?.editorType === 'sandpack',
                    contents: () => <ShowSandpackInfo />,
                  },
                  {
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                        {showSandpack && <InsertSandpack />}
                      </>
                    ),
                  },
                ]}
              />
            )}
          </>
        ),
      })
    },
  ]);

  return (
    <MDXEditor
      className='mdxEditor flex flex-col gap-4'
      markdown={value}
      onChange={onChange}
      plugins={plugins}
      contentEditableClassName='h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-foreground-muted focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
    />
  );
};

export default MarkdownEditor;