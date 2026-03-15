import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getUserId() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('users').select('*').eq('id', userId).single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { room_no, hostel, upi_id } = body

  const { data, error } = await supabaseAdmin
    .from('users').update({ room_no, hostel, upi_id })
    .eq('id', userId).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
