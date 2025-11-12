//app/api/session/route.ts
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export async function GET() {
    const user = await getSession()
    return NextResponse.json({ user });
}