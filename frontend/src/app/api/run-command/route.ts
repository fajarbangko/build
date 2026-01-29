import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: Request) {
    try {
        const { command } = await request.json();
        let cmd = '';

        switch (command) {
            case 'build':
                cmd = 'npm run build';
                break;
            case 'sync':
                cmd = 'npx cap sync';
                break;
            case 'open':
                cmd = 'npx cap open android';
                break;
            default:
                return NextResponse.json({ success: false, error: 'Invalid command' }, { status: 400 });
        }

        // Execute the command
        // Note: For 'open', we don't await completion because it launches a separate GUI process
        if (command === 'open') {
            exec(cmd);
            return NextResponse.json({ success: true, message: 'Android Studio Opening...' });
        }

        const { stdout, stderr } = await execPromise(cmd);

        return NextResponse.json({ success: true, output: stdout });

    } catch (error: any) {
        console.error('Command failed:', error);
        return NextResponse.json({ success: false, error: error.message || 'Command failed' }, { status: 500 });
    }
}
