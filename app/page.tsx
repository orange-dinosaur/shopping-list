'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, LogOut, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { UserMenu } from '@/components/user-menu';

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
    const [lists, setLists] = useState<CategoryList[]>(initialLists);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
        {}
    );

    const handleAddItem = (listIndex: number) => {
        const inputValue = inputValues[listIndex] || '';
        if (!inputValue.trim()) return;

        setLists((prevLists) => {
            const newLists = [...prevLists];
            newLists[listIndex] = {
                ...newLists[listIndex],
                items: [
                    ...newLists[listIndex].items,
                    { id: Date.now().toString(), name: inputValue.trim() },
                ],
            };
            return newLists;
        });

        setInputValues((prev) => ({ ...prev, [listIndex]: '' }));
    };

    const handleDeleteItem = (listIndex: number, itemId: string) => {
        setLists((prevLists) => {
            const newLists = [...prevLists];
            newLists[listIndex] = {
                ...newLists[listIndex],
                items: newLists[listIndex].items.filter(
                    (item) => item.id !== itemId
                ),
            };
            return newLists;
        });
    };

    const handleInputChange = (listIndex: number, value: string) => {
        setInputValues((prev) => ({ ...prev, [listIndex]: value }));
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        listIndex: number
    ) => {
        if (e.key === 'Enter') {
            handleAddItem(listIndex);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hello, Alex!
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Ready to tackle your shopping list today?
                    </p>
                </div>

                {/* Lists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {lists.map((list, listIndex) => (
                        <Collapsible key={list.name} defaultOpen>
                            <Card
                                className={`border-t-4 ${list.borderColor} ${list.bgColor} shadow-sm`}>
                                <CardHeader className="pb-4">
                                    <CollapsibleTrigger asChild>
                                        <button className="w-full flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <CardTitle className="text-lg font-semibold">
                                                    {list.name}
                                                </CardTitle>
                                                <Badge
                                                    variant="secondary"
                                                    className={`${list.tagBgColor} ${list.tagTextColor} font-medium text-xs hover:${list.tagBgColor}`}>
                                                    {list.tag}
                                                </Badge>
                                            </div>
                                            <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                        </button>
                                    </CollapsibleTrigger>
                                </CardHeader>
                                <CollapsibleContent>
                                    <CardContent className="pt-0">
                                        {/* Add Item Input */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <Input
                                                placeholder="Add item..."
                                                value={
                                                    inputValues[listIndex] || ''
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        listIndex,
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyDown(e, listIndex)
                                                }
                                                className="flex-1 bg-white/80 border-gray-200 text-sm"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleAddItem(listIndex)
                                                }
                                                className="h-9 w-9 text-gray-400 hover:text-green-600 hover:bg-green-50">
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        {/* Items List */}
                                        <div className="space-y-2">
                                            {list.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between py-2 px-1 hover:bg-white/60 rounded-md group transition-colors">
                                                    <span className="text-sm text-gray-700">
                                                        {item.name}
                                                    </span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                listIndex,
                                                                item.id
                                                            )
                                                        }
                                                        className="h-7 w-7 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </CollapsibleContent>
                            </Card>
                        </Collapsible>
                    ))}
                </div>
            </main>
        </div>
    );
}
