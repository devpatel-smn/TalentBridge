import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { cn } from '@/lib/utils';

interface ImageCarouselSlide {
    src: string;
    alt: string;
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
            <div className="relative overflow-hidden rounded-2xl">
                <div
                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <img
                            key={slide.src}
                            src={slide.src}
                            alt={slide.alt}
                            className={cn('w-full shrink-0 object-cover', imageClassName)}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    ))}
                </div>
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
                        return (
                            <button
                                key={slide.src}
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
