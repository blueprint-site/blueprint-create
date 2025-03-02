import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

const MarkdownDisplay = ({
  content,
  className = ""
}: MarkdownDisplayProps) => {
  // Ensure content is a string
  const markdownContent = typeof content === 'string' ? content : String(content);

  // Remove escaped backslashes before markdown syntax characters
  const unescapedContent = markdownContent
    .replace(/\\#/g, '#')  // Fix headings
    .replace(/\\\*/g, '*') // Fix bold/italic
    .replace(/\\\[/g, '[') // Fix links and images
    .replace(/\\\]/g, ']')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\`/g, '`') // Fix code blocks
    .replace(/\\~/g, '~') // Fix strikethrough
    .replace(/\\>/g, '>') // Fix blockquotes
    .replace(/\\-/g, '-') // Fix lists
    .replace(/\\\+/g, '+')
    .replace(/\\\|/g, '|') // Fix tables
    .replace(/\\\\/g, '\\'); // Fix actual backslashes

  return (
    <div className={`prose max-w-none overflow-hidden ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]}>
        {unescapedContent}
      </Markdown>
    </div>
  );
};

export default MarkdownDisplay;