//app/api/session/route.ts
import { getSession } from '@/lib/auth/session'
import { NextResponse } from 'next/server'

export async function GET() {
    console.log('API Session Called')
    const user = await getSession()
    console.log('API Session User:', user)
    return NextResponse.json({ user });
}