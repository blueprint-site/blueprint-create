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
    ChangeCodeMirrorLanguage, ShowSandpackInfo, SandpackConfig, markdownShortcutPlugin, quotePlugin,
} from '@mdxeditor/editor';

const MarkdownEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const ogValue = value
    const defaultSnippetContent = `
export default function App() {
  return (
    <div>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()
    const htmlSnippetContent = `

<html lang="en">

<head>
  <meta charset="UTF-8" />

  <title> Hello world </title>
</head>

<body>
<h1> Hello world 🤜</h1>
</body>


</html>

`.trim()

    const simpleSandpackConfig: SandpackConfig = {
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
                initialSnippetContent: defaultSnippetContent
            },
            {
                label: 'Html',
                name: 'html',
                meta: 'live static',
                sandpackTemplate: 'static',
                sandpackTheme: 'auto',
                snippetFileName: '/index.html',
                snippetLanguage: 'html',
                initialSnippetContent: htmlSnippetContent
            }
        ]
    }
    return (
        <>
            <MDXEditor
                className="mdxEditor"
                markdown={value}
                onChange={onChange}
                plugins={[
                    headingsPlugin(),
                    tablePlugin(),
                    listsPlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    quotePlugin(),
                    frontmatterPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                    sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
                    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
                    diffSourcePlugin({
                        diffMarkdown: ogValue,
                    }),
                    codeMirrorPlugin({
                        codeBlockLanguages: {
                            javascript: 'JavaScript',
                            python: 'Python',
                            css: 'CSS',
                            html: 'HTML',
                        },
                    }),
                    imagePlugin({
                        imageUploadHandler: () => {
                            return Promise.resolve('https://picsum.photos/200/300')
                        },
                        imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
                    }),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <BlockTypeSelect/>
                                <BoldItalicUnderlineToggles />
                                <CreateLink/>
                                <CodeToggle/>
                                <ListsToggle></ListsToggle>
                                <InsertThematicBreak/>
                                <InsertCodeBlock />
                                <InsertTable />
                                <InsertFrontmatter/>
                                <InsertImage/>
                                <UndoRedo/>
                                <DiffSourceToggleWrapper children={undefined}/> <ConditionalContents
                                options={[
                                    { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                                    { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                                    {
                                        fallback: () => (
                                            <>
                                                <InsertCodeBlock />
                                                <InsertSandpack />
                                            </>
                                        )
                                    }
                                ]}
                            />

                            </>


                        ),
                    }),
                ]}
            />


        </>
    );
};

export default MarkdownEditor;
