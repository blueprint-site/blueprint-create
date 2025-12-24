import { CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';

interface ExpandedAddonDescriptionProps {
  description: string;
}

export const ExpandedAddonDescription = ({ description = '' }: ExpandedAddonDescriptionProps) => {
  if (!description) {
    return (
      <CardContent className='py-6'>
        <h2 className='mb-4 text-xl font-semibold'>Description</h2>
        <p className='text-muted-foreground'>No description available.</p>
      </CardContent>
    );
  }

  return (
    <CardContent className='py-6 text-black'>
      <h2 className='mb-4 text-xl font-semibold'>Description</h2>
      <div className='markdown-body'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => <h1 className='mb-4 text-3xl font-bold'>{children}</h1>,
            h2: ({ children }) => <h2 className='mb-3 text-2xl font-semibold'>{children}</h2>,
            h3: ({ children }) => <h3 className='mb-2 text-xl font-semibold'>{children}</h3>,
            h4: ({ children }) => <h4 className='mb-2 text-lg font-semibold'>{children}</h4>,
            h5: ({ children }) => <h5 className='mb-1 text-base font-semibold'>{children}</h5>,
            h6: ({ children }) => <h6 className='mb-1 text-sm font-semibold'>{children}</h6>,
            p: ({ children }) => <p className='mb-4'>{children}</p>,
            ul: ({ children }) => <ul className='mb-4 list-inside list-disc'>{children}</ul>,
            ol: ({ children }) => <ol className='mb-4 list-inside list-decimal'>{children}</ol>,
            li: ({ children }) => <li className='mb-1'>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className='mb-4 border-l-4 border-gray-300 pl-4 italic'>
                {children}
              </blockquote>
            ),
            code: ({ className, children }) => {
              const isInline = !className;
              return isInline ? (
                <code className='rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800'>
                  {children}
                </code>
              ) : (
                <pre className='mb-4 overflow-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800'>
                  <code className={className}>{children}</code>
                </pre>
              );
            },
            hr: () => <hr className='my-6 border-gray-300 dark:border-gray-700' />,
            a: ({ href, children }) => (
              <a
                href={href}
                className='text-blue-600 hover:underline'
                target='_blank'
                rel='noopener noreferrer'
              >
                {children}
              </a>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className='my-4 h-auto max-w-full rounded-lg'
                loading='lazy'
              />
            ),
            table: ({ children }) => (
              <div className='mb-4 overflow-x-auto'>
                <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className='bg-gray-50 dark:bg-gray-800'>{children}</thead>
            ),
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr className='border-b border-gray-300 dark:border-gray-700'>{children}</tr>
            ),
            th: ({ children }) => <th className='px-4 py-2 text-left font-semibold'>{children}</th>,
            td: ({ children }) => <td className='px-4 py-2'>{children}</td>,
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
    </CardContent>
  );
};

