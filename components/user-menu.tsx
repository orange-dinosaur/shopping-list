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

export function UserMenu() {
    const [user, setUser] = useState<{
        name?: string;
        image?: string | null;
    } | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await authClient.getSession();
            console.log('Session: ', session);
            setUser(session?.data?.user ?? null);
        };
        fetchSession();
    }, []);

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
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    onClick={() => {
                        // TODO: Implement actual logout logic
                        console.log('Logout clicked');
                    }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
