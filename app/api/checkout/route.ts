import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const payload = await request.json()

  console.log('[API] Checkout payload received:', JSON.stringify(payload, null, 2))

  return NextResponse.json({ success: true, message: 'Payment processed' })
}
