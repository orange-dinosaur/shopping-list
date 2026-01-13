'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import {
    getListItems,
    addListItem,
    deleteListItem,
} from '@/lib/actions/list-items';
import { toast } from '@/components/ui/sonner';

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

const categoryConfig = [
    {
        name: 'Red',
        tag: 'nope',
        borderColor: 'border-t-red-500',
        bgColor: 'bg-red-50/50',
        tagBgColor: 'bg-red-100',
        tagTextColor: 'text-red-700',
    },
    {
        name: 'Orange',
        tag: 'mmmmh',
        borderColor: 'border-t-orange-500',
        bgColor: 'bg-orange-50/50',
        tagBgColor: 'bg-orange-100',
        tagTextColor: 'text-orange-700',
    },
    {
        name: 'Yellow',
        tag: 'sometimes',
        borderColor: 'border-t-yellow-500',
        bgColor: 'bg-yellow-50/50',
        tagBgColor: 'bg-yellow-100',
        tagTextColor: 'text-yellow-700',
    },
    {
        name: 'Green',
        tag: 'yes',
        borderColor: 'border-t-green-500',
        bgColor: 'bg-green-50/50',
        tagBgColor: 'bg-green-100',
        tagTextColor: 'text-green-700',
    },
];

export function Lists() {
    const [lists, setLists] = useState<CategoryList[]>(
        categoryConfig.map((config) => ({ ...config, items: [] }))
    );
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
        {}
    );
    const [isLoading, setIsLoading] = useState(true);
    const [pendingItems, setPendingItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchItems() {
            const result = await getListItems();
            if (result.status === 200) {
                setLists(
                    categoryConfig.map((config) => ({
                        ...config,
                        items: result.items
                            .filter((item) => item.list === config.name)
                            .map((item) => ({ id: item.id, name: item.name })),
                    }))
                );
            } else if (result.status === 401) {
                // User not logged in - keep empty lists
            } else {
                toast.error(result.message || 'Failed to load items');
            }
            setIsLoading(false);
        }
        fetchItems();
    }, []);

    const handleAddItem = async (listIndex: number) => {
        const inputValue = inputValues[listIndex] || '';
        if (!inputValue.trim()) return;

        const listName = lists[listIndex].name;

        // Optimistic update
        const tempId = `temp-${crypto.randomUUID()}`;
        setLists((prevLists) => {
            const newLists = [...prevLists];
            newLists[listIndex] = {
                ...newLists[listIndex],
                items: [
                    ...newLists[listIndex].items,
                    { id: tempId, name: inputValue.trim() },
                ],
            };
            return newLists;
        });
        setInputValues((prev) => ({ ...prev, [listIndex]: '' }));

        const result = await addListItem(listName, inputValue.trim());

        if (result.status === 200 && result.item) {
            // Replace temp ID with real ID
            setLists((prevLists) => {
                const newLists = [...prevLists];
                newLists[listIndex] = {
                    ...newLists[listIndex],
                    items: newLists[listIndex].items.map((item) =>
                        item.id === tempId
                            ? { id: result.item!.id, name: result.item!.name }
                            : item
                    ),
                };
                return newLists;
            });
        } else {
            // Rollback on error
            setLists((prevLists) => {
                const newLists = [...prevLists];
                newLists[listIndex] = {
                    ...newLists[listIndex],
                    items: newLists[listIndex].items.filter(
                        (item) => item.id !== tempId
                    ),
                };
                return newLists;
            });
            toast.error(result.message || 'Failed to add item');
        }
    };

    const handleDeleteItem = async (listIndex: number, itemId: string) => {
        if (pendingItems.has(itemId)) return;

        setPendingItems((prev) => new Set(prev).add(itemId));

        // Optimistic update
        const deletedItem = lists[listIndex].items.find(
            (item) => item.id === itemId
        );
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

        const result = await deleteListItem(itemId);

        if (result.status !== 200) {
            // Rollback on error
            if (deletedItem) {
                setLists((prevLists) => {
                    const newLists = [...prevLists];
                    newLists[listIndex] = {
                        ...newLists[listIndex],
                        items: [...newLists[listIndex].items, deletedItem],
                    };
                    return newLists;
                });
            }
            toast.error(result.message || 'Failed to delete item');
        }

        setPendingItems((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lists.map((list, listIndex) => (
                <Collapsible key={list.name} defaultOpen>
                    <Card
                        className={`border-t-4 ${list.borderColor} ${list.bgColor} shadow-sm`}>
                        <CardHeader className="pb-4">
                            <CollapsibleTrigger asChild>
                                <button className="w-full flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-xl font-bold">
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
                                        value={inputValues[listIndex] || ''}
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
                                        onClick={() => handleAddItem(listIndex)}
                                        className="h-9 w-9 text-gray-400 hover:text-green-600 hover:bg-green-50">
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>

                                {/* Items List */}
                                <div>
                                    {list.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between gap-2 py-1 px-1 hover:bg-white/60 rounded-md group transition-colors min-w-0 w-full">
                                            <span className="text-md text-gray-700 font-semibold flex-1 break-words whitespace-normal min-w-0">
                                                • {item.name}
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
                                                className="h-7 w-7 mt-0.5 text-red-400 md:text-gray-300 hover:text-red-500 hover:bg-red-50 transition-opacity flex-shrink-0">
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
    );
}
