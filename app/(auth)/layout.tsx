'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FieldDescription } from '@/components/ui/field';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-start gap-8 p-6 pt-20 md:p-10 md:pt-32">
            <div className="flex flex-col items-center gap-6 text-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="App Logo"
                        width={50}
                        height={50}
                        className="w-auto"
                    />
                </Link>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-xl font-bold">
                        Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
                    </h1>
                    <FieldDescription>
                        {pathname === '/login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <Link href="/signup">Sign up</Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Link href="/login">Login</Link>
                            </>
                        )}
                    </FieldDescription>
                </div>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-6">
                {children}
            </div>
        </div>
    );
}
