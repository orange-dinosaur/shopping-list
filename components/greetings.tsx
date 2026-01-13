'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function Greetings() {
    const [user, setUser] = useState<{
        name?: string;
        image?: string | null;
    } | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await authClient.getSession();
            setUser(session?.data?.user ?? null);
        };
        fetchSession();
    }, []);

    return (
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
                Hello, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-500 mt-1">
                Ready to tackle your shopping list today?
            </p>
        </div>
    );
}
