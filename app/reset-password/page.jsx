import dynamic from 'next/dynamic'; import { Suspense } from 'react';
// Dynamically import the client component with SSR disabled
const ResetPasswordClient = dynamic(
    () => import('./ResetPasswordClient'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-[#9a9a9a]">Loading...</p>
                </div>
            </div>
        )
    }
);

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-[#9a9a9a]">Loading...</p>
                </div>
            </div>
        }>
            <ResetPasswordClient />
        </Suspense>
    );
}