import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {marked} from "marked";
import DOMPurify from 'dompurify';
export interface AddonDetailsDescriptionProps {
    description: string
}
export const AddonDetailsDescription = ({description = ''}: AddonDetailsDescriptionProps) => {
    const [descriptionFormated, setDescription] = useState<string>('');

    useEffect(() => {
        const loadAddonDetails = async () => {
            try {
                // Process markdown description
                if (description) {
                    const markedHtml = await marked(description || '');
                    const sanitizedHtml = DOMPurify.sanitize(markedHtml, {
                        ALLOWED_TAGS: [
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'p',
                            'a',
                            'ul',
                            'ol',
                            'li',
                            'code',
                            'pre',
                            'strong',
                            'em',
                            'img',
                        ],
                        ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
                    });
                    setDescription(sanitizedHtml);
                }
            } catch (err) {
                console.error('Error loading addon details:', err);
            }
        };

        loadAddonDetails().then();
    }, [description]);


    return(
        <Card>
            <CardContent className='prose prose-neutral dark:prose-invert max-w-none p-6'>
                <div dangerouslySetInnerHTML={{ __html: descriptionFormated }} className='markdown-content' />
            </CardContent>
        </Card>

    )
}