import { useState } from 'react';
import MarkdownEditor from '@/components/utility/MarkdownEditor.tsx';
import MarkdownDisplay from '@/components/utility/MarkdownDisplay.tsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, GripVertical } from 'lucide-react';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useToast } from '@/hooks';

export const ChangelogsEditor = () => {
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(``);
  const { toast } = useToast();

  const handleCopy = () => {
    const changelog = {
      version,
      title,
      content,
    };
    navigator.clipboard.writeText(JSON.stringify(changelog, null, 2));
    toast({ description: 'Changelog copied to clipboard!' });
  };

  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex gap-2'>
        <Input placeholder='Version' value={version} onChange={(e) => setVersion(e.target.value)} />
        <Input
          placeholder='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='flex-1'
        />
        <Button onClick={handleCopy} variant='secondary' className='flex items-center gap-2'>
          <Copy size={16} /> Copy Changelog
        </Button>
      </div>

      <Separator orientation='horizontal' className='my-2' />

      <PanelGroup direction='horizontal'>
        <Panel defaultSize={50} minSize={20}>
          <div className='bg-surface-1 h-full p-2'>
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
        </Panel>
        <PanelResizeHandle className='bg-surface-1 cursor-col-resize p-1'>
          <GripVertical size={8} />
        </PanelResizeHandle>
        <Panel defaultSize={50} minSize={20}>
          <div className='bg-surface-1 h-full border-l p-2'>
            <MarkdownDisplay content={content} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ChangelogsEditor;
