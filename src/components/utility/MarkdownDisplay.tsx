import React, { useEffect, useState } from 'react';
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
  // Local state to ensure proper updates
  const [markdownContent, setMarkdownContent] = useState(content);

  // Keep local state in sync with props
  useEffect(() => {
    setMarkdownContent(content);
  }, [content]);

  // Generate plugins only once
  const plugins = React.useMemo(() => [
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
  ], []);

  // Force re-render if content changes
  return (
    <MDXEditor
      key={`markdown-display-${markdownContent.length}`}
      markdown={markdownContent}
      readOnly
      plugins={plugins}
      contentEditableClassName="prose max-w-none"
    />
  );
};

export default MarkdownDisplay;