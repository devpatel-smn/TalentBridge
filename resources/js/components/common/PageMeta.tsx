import { useEffect } from 'react';

interface PageMetaProps {
    title: string;
    description?: string;
}

const SITE_NAME = 'TalentBridge';

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
    let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
    }
    element.content = content;
}

export function PageMeta({ title, description }: PageMetaProps) {
    useEffect(() => {
        const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
        document.title = fullTitle;

        if (description) {
            upsertMeta('description', description);
            upsertMeta('og:title', fullTitle, 'property');
            upsertMeta('og:description', description, 'property');
        }

        return () => {
            document.title = SITE_NAME;
        };
    }, [title, description]);

    return null;
}
