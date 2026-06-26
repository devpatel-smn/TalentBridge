import { Outlet } from 'react-router-dom';
import { PageTransition } from '@/components/common/PageTransition';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { PublicHeader } from '@/components/layout/PublicHeader';

export function PublicLayout() {
    return (
        <div className="flex min-h-screen min-w-0 flex-col">
            <PublicHeader />
            <main className="min-w-0 flex-1 overflow-x-hidden pt-[4.5rem]">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <PublicFooter />
        </div>
    );
}
