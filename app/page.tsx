'use client';

import Image from 'next/image';
import { UserMenu } from '@/components/user-menu';
import { Greetings } from '@/components/greetings';
import { Lists } from '@/components/lists';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="App Logo"
                            width={30}
                            height={30}
                            className="w-auto"
                        />
                        <span className="font-bold text-xl">Shopping List</span>
                    </div>
                    <UserMenu />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 pt-20">
                <Greetings />

                <Lists />
            </main>
        </div>
    );
}
