import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { cn } from '@/lib/utils';
import { resolveImageFallback, resolveImageSrc } from '@/lib/images';

interface ImageCarouselSlide {
    src: string | { webp: string; fallback: string };
    alt: string;
    className?: string;
}

interface ImageCarouselProps {
    slides: ImageCarouselSlide[];
    intervalMs?: number;
    className?: string;
    imageClassName?: string;
    showIndicators?: boolean;
    indicatorClassName?: string;
    overlay?: ReactNode;
}

export function ImageCarousel({
    slides,
    intervalMs = 2500,
    className,
    imageClassName,
    showIndicators = true,
    indicatorClassName,
    overlay,
}: ImageCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loadedIndices, setLoadedIndices] = useState<Set<number>>(() => new Set([0]));
    const touchStartX = useRef(0);

    const goTo = useCallback(
        (index: number) => {
            setActiveIndex((index + slides.length) % slides.length);
        },
        [slides.length],
    );

    const goNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const handleTouchStart = (event: TouchEvent) => {
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
        const diff = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) < 50) return;

        if (diff < 0) {
            goNext();
            return;
        }

        goPrev();
    };

    useEffect(() => {
        const nextIndex = (activeIndex + 1) % slides.length;
        setLoadedIndices((prev) => {
            const next = new Set(prev);
            next.add(activeIndex);
            next.add(nextIndex);
            return next;
        });
    }, [activeIndex, slides.length]);

    useEffect(() => {
        if (slides.length <= 1 || isPaused) return;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.matches) return;

        const intervalId = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, intervalMs);

        return () => window.clearInterval(intervalId);
    }, [slides.length, intervalMs, isPaused]);

    if (slides.length === 0) return null;

    return (
        <div
            className={cn('relative', className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className={cn('relative overflow-hidden', imageClassName)}>
                {slides.map((slide, index) => {
                    if (!loadedIndices.has(index)) return null;

                    const isActive = index === activeIndex;
                    const webpSrc = resolveImageSrc(slide.src);
                    const fallbackSrc = resolveImageFallback(slide.src);

                    return (
                        <picture key={typeof slide.src === 'string' ? slide.src : slide.src.webp}>
                            {fallbackSrc && <source srcSet={webpSrc} type="image/webp" />}
                            <img
                                src={fallbackSrc ?? webpSrc}
                                alt={slide.alt}
                                className={cn(
                                    'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                                    isActive ? 'z-10 opacity-100' : 'z-0 opacity-0',
                                    slide.className,
                                )}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                            />
                        </picture>
                    );
                })}
                {overlay}
            </div>

            {showIndicators && slides.length > 1 && (
                <div
                    className={cn(
                        'mt-4 flex items-center justify-center gap-2',
                        indicatorClassName,
                    )}
                    role="tablist"
                    aria-label="Carousel slides"
                >
                    {slides.map((slide, index) => {
                        const isActive = index === activeIndex;
                        const key = typeof slide.src === 'string' ? slide.src : slide.src.webp;
                        return (
                            <button
                                key={key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => goTo(index)}
                                className={cn(
                                    'h-2.5 w-2.5 rounded-full border transition-all duration-300 motion-reduce:transition-none',
                                    isActive
                                        ? 'border-gold bg-gold scale-110'
                                        : 'border-muted-foreground/40 bg-transparent hover:border-muted-foreground/60',
                                )}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
