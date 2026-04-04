import { Children, isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
interface ExpandedAddonDescriptionProps {
  description: string;
}

const isHastWhitespaceText = (value: unknown): boolean => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    (value as { type?: string; value?: string }).type === 'text' &&
    ((value as { value?: string }).value || '').trim() === ''
  );
};

const isHastElement = (value: unknown, tagName: string): boolean => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    (value as { type?: string; tagName?: string }).type === 'element' &&
    (value as { tagName?: string }).tagName === tagName
  );
};

const isHastLinkWrappedImage = (value: unknown): boolean => {
  if (!isHastElement(value, 'a')) {
    return false;
  }

  const children = (value as { children?: unknown[] }).children ?? [];

  return children.every((child) => isHastWhitespaceText(child) || isHastElement(child, 'img'));
};

const isMediaOnlyParagraphNode = (node: unknown): boolean => {
  if (!node || typeof node !== 'object') {
    return false;
  }

  const hastNode = node as {
    type?: string;
    tagName?: string;
    children?: unknown[];
  };

  if (hastNode.type !== 'element' || hastNode.tagName !== 'p') {
    return false;
  }

  const content = (hastNode.children ?? []).filter((child) => !isHastWhitespaceText(child));

  return (
    content.length > 0 &&
    content.every((child) => isHastElement(child, 'img') || isHastLinkWrappedImage(child))
  );
};

export const ExpandedAddonDescription = ({ description = '' }: ExpandedAddonDescriptionProps) => {
  if (!description) {
    return (
      <CardContent className='py-6 border'>
        <h2 className='mb-4 text-xl font-semibold'>Description</h2>
        <p className='text-muted-foreground'>No description available.</p>
      </CardContent>
    );
  }

  return (
    <Card className='text-white '>
      <CardTitle className='px-6 text-2xl font-minecraft'>Description</CardTitle>
      <CardContent className=''>
        <div className='markdown-body'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              div: ({ ...props }) => <div {...props} />,
              a: ({ node, children, className, ...props }) => {
                const href = props.href || '';
                const hasImageChild = Children.toArray(children).some((child) =>
                  isValidElement(child) ? child.type === 'img' : false
                );

                if (href.startsWith('/linkout?remoteUrl=')) {
                  try {
                    const url = new URL(href, window.location.origin);
                    const remoteUrl = url.searchParams.get('remoteUrl');
                    if (remoteUrl) {
                      const decodedUrl = decodeURIComponent(remoteUrl);
                      return (
                        <a
                          {...props}
                          href={decodedUrl}
                          className={[
                            className,
                            hasImageChild ? 'inline-flex items-start' : 'underline text-blue-200',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {children}
                        </a>
                      );
                    }
                  } catch (error) {
                    console.error('Error parsing linkout URL:', error);
                  }
                }
                return (
                  <a
                    {...props}
                    className={[
                      className,
                      hasImageChild ? 'inline-flex items-start' : 'underline text-blue-200',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {children}
                  </a>
                );
              },
              img: ({ className, ...props }) => (
                <img {...props} className={[className, 'block h-auto'].filter(Boolean).join(' ')} />
              ),
              p: ({ node, children, className, ...props }) => {
                const isImageOnlyParagraph = isMediaOnlyParagraphNode(node);

                return (
                  <p
                    {...props}
                    className={[
                      className,
                      isImageOnlyParagraph ? 'flex flex-wrap items-start gap-4' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {children}
                  </p>
                );
              },
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </CardContent>
      <CardFooter className='text-xs font-minecraft opacity-80'>
        Note: any advertisements or affiliate links present in addon descriptions are added by the
        their authors and not Blueprint
      </CardFooter>
    </Card>
  );
};
