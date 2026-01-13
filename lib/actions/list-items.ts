'use server';

import { db } from '@/lib/db/db';
import { listItem } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';

export async function getListItems() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: 401, message: 'Unauthorized', items: [] };
    }

    try {
        const items = await db
            .select()
            .from(listItem)
            .where(eq(listItem.userId, session.user.id))
            .orderBy(listItem.createdAt);

        return { status: 200, items };
    } catch (error) {
        console.error('Error fetching list items:', error);
        return { status: 500, message: 'Failed to fetch items', items: [] };
    }
}

export async function addListItem(list: string, name: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: 401, message: 'Unauthorized' };
    }

    if (!list || !name.trim()) {
        return { status: 400, message: 'List and name are required' };
    }

    try {
        const id = crypto.randomUUID();
        await db.insert(listItem).values({
            id,
            userId: session.user.id,
            list,
            name: name.trim(),
        });

        return { status: 200, item: { id, name: name.trim() } };
    } catch (error) {
        console.error('Error adding list item:', error);
        return { status: 500, message: 'Failed to add item' };
    }
}

export async function deleteListItem(itemId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: 401, message: 'Unauthorized' };
    }

    try {
        const result = await db
            .delete(listItem)
            .where(
                and(
                    eq(listItem.id, itemId),
                    eq(listItem.userId, session.user.id)
                )
            );

        if (result.rowCount === 0) {
            return { status: 404, message: 'Item not found' };
        }

        return { status: 200 };
    } catch (error) {
        console.error('Error deleting list item:', error);
        return { status: 500, message: 'Failed to delete item' };
    }
}
