import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  headingsPlugin,
  tablePlugin,
  listsPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  imagePlugin,
} from '@mdxeditor/editor';

const MarkdownDisplay = ({ content }: { content: string }) => {
  return (
    <MDXEditor
      markdown={content}
      readOnly
      plugins={[
        headingsPlugin(),
        tablePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        quotePlugin(),
        frontmatterPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        sandpackPlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            javascript: 'JavaScript',
            python: 'Python',
            css: 'CSS',
            html: 'HTML',
          },
        }),
        imagePlugin(),
      ]}
    />
  );
};

export default MarkdownDisplay;
