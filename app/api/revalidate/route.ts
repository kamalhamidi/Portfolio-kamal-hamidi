import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
    try {
        revalidatePath('/');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ revalidated: false, error: message }, { status: 500 });
    }
}
