import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { resolveImageFallback, resolveImageSrc, type ImageSource } from '@/lib/images';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'src'> {
    src: ImageSource;
    priority?: boolean;
    wrapperClassName?: string;
    aspectRatio?: string;
    fixedHeight?: string;
}

export function OptimizedImage({
    className,
    wrapperClassName,
    alt,
    src,
    priority = false,
    aspectRatio,
    fixedHeight,
    onLoad,
    ...props
}: OptimizedImageProps) {
    const [loaded, setLoaded] = useState(false);
    const imageSrc = resolveImageSrc(src);
    const fallbackSrc = resolveImageFallback(src);

    return (
        <div
            className={cn('relative overflow-hidden bg-muted/30', wrapperClassName)}
            style={{
                ...(aspectRatio ? { aspectRatio } : {}),
                ...(fixedHeight ? { height: fixedHeight } : {}),
            }}
        >
            {!loaded && (
                <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />
            )}
            <picture>
                {fallbackSrc && <source srcSet={imageSrc} type="image/webp" />}
                <img
                    alt={alt}
                    src={fallbackSrc ?? imageSrc}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={priority ? 'high' : 'auto'}
                    className={cn(
                        'h-full w-full object-cover object-center transition-opacity duration-300 ease-out motion-reduce:transition-none',
                        loaded ? 'opacity-100' : 'opacity-0',
                        className,
                    )}
                    onLoad={(event) => {
                        setLoaded(true);
                        onLoad?.(event);
                    }}
                    {...props}
                />
            </picture>
        </div>
    );
}
