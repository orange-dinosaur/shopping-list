'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth/logout';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/sonner';

export function UserMenu() {
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

    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setPending(true);

        const result = await logout();

        if (result.status !== 200) {
            toast.error(result.message || 'Logout failed');
            setPending(false);
            return;
        }

        router.push('/login');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image || ''} alt="Profile" />
                        <AvatarFallback className="bg-orange-200 text-orange-800 text-sm">
                            A
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-gray-700">
                        {user?.name || 'User'}
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <form onSubmit={handleSubmit} className="w-full">
                        <button
                            type="submit"
                            disabled={pending}
                            className="flex w-full items-center gap-2 cursor-pointer">
                            <LogOut />
                            Log out
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
