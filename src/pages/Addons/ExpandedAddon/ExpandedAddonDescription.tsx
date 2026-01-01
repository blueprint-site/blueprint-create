import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
interface ExpandedAddonDescriptionProps {
  description: string;
}

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
    <Card className=''>
    <CardTitle className='px-6 pt-6 text-2xl font-minecraft'>Description</CardTitle>
    <CardContent className='py-6 text-black '>
      <div className='markdown-body'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          components={{
            div: ({ node, ...props }) => <div {...props} />,
            a: ({ node, ...props }) => {
              const href = props.href || '';
              if (href.startsWith('/linkout?remoteUrl=')) {
                try {
                  const url = new URL(href, window.location.origin);
                  const remoteUrl = url.searchParams.get('remoteUrl');
                  if (remoteUrl) {
                    const decodedUrl = decodeURIComponent(remoteUrl);
                    return <a {...props} href={decodedUrl} />;
                  }
                } catch (error) {
                  console.error('Error parsing linkout URL:', error);
                }
              }
              return <a {...props} />;
            },
          }}
        >
          {description}
        </ReactMarkdown>
      </div>
    </CardContent>
    </Card>
  );
};

