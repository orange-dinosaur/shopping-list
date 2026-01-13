'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { UserMenu } from '@/components/user-menu';
import { Greetings } from '@/components/greetings';
import { Lists } from '@/components/lists';

interface ShoppingItem {
    id: string;
    name: string;
}

interface CategoryList {
    name: string;
    tag: string;
    borderColor: string;
    bgColor: string;
    tagBgColor: string;
    tagTextColor: string;
    items: ShoppingItem[];
}

const initialLists: CategoryList[] = [
    {
        name: 'Red',
        tag: 'nope',
        borderColor: 'border-t-red-500',
        bgColor: 'bg-red-50/50',
        tagBgColor: 'bg-red-100',
        tagTextColor: 'text-red-700',
        items: [],
    },
    {
        name: 'Orange',
        tag: 'mmmmh',
        borderColor: 'border-t-orange-500',
        bgColor: 'bg-orange-50/50',
        tagBgColor: 'bg-orange-100',
        tagTextColor: 'text-orange-700',
        items: [],
    },
    {
        name: 'Yellow',
        tag: 'sometimes',
        borderColor: 'border-t-yellow-500',
        bgColor: 'bg-yellow-50/50',
        tagBgColor: 'bg-yellow-100',
        tagTextColor: 'text-yellow-700',
        items: [],
    },
    {
        name: 'Green',
        tag: 'yes',
        borderColor: 'border-t-green-500',
        bgColor: 'bg-green-50/50',
        tagBgColor: 'bg-green-100',
        tagTextColor: 'text-green-700',
        items: [],
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
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

            <main className="max-w-7xl mx-auto px-6 py-8">
                <Greetings />

                <Lists />
            </main>
        </div>
    );
}
