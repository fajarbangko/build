import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const filePath = path.join(process.cwd(), 'src', 'stores', 'initialState.json');

        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

        return NextResponse.json({ success: true, message: 'Design saved to project successfully!' });
    } catch (error) {
        console.error('Error saving design:', error);
        return NextResponse.json({ success: false, error: 'Failed to save design' }, { status: 500 });
    }
}
