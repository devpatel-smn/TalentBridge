import type { LucideProps } from 'lucide-react';

export const iconDefaults: LucideProps = {
    strokeWidth: 1.75,
    absoluteStrokeWidth: true,
};

export function withIconDefaults(props?: LucideProps): LucideProps {
    return { ...iconDefaults, ...props };
}
