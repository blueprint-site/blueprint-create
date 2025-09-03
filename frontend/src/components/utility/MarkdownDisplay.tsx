import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

const MarkdownDisplay = ({ content, className = '' }: MarkdownDisplayProps) => {
  // Ensure content is a string
  const unescapedContent = content
    .replace(/\\#/g, '#') // Fix headings
    .replace(/\\\*/g, '*') // Fix bold/italic
    .replace(/\\\[/g, '[') // Fix links and images
    .replace(/\\]/g, ']')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\`/g, '`') // Fix code blocks
    .replace(/\\~/g, '~') // Fix strikethrough
    .replace(/\\>/g, '>') // Fix blockquotes
    .replace(/\\\+/g, '+')
    .replace(/\\!-/g, '-')
    .replace(/\\---/g, '---')
    .replace(/\\\|/g, '|') // Fix tables
    .replace(/\\\\/g, '\\'); // Fix actual backslashes

  return (
    <div className={`prose max-w-none overflow-hidden ${className}`}>
      {' '}
      {/* Use styles.markdown */}
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Customize link rendering
          a: ({ ...props }) => (
            <a
              {...props}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blueprint hover:text-blueprint underline'
            />
          ),
          // Add other component customizations as needed
          img: ({ ...props }) => <img {...props} className='my-4 h-auto max-w-full rounded-lg' />,
          code: ({ ...props }) => <code className='rounded bg-gray-100 px-1 py-0.5' {...props} />,
        }}
      >
        {unescapedContent}
      </Markdown>
    </div>
  );
};

export default MarkdownDisplay;
