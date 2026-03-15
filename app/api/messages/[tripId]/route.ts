import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getUserId() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export async function GET(_: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('messages')
    .select(`*, sender:users(full_name, avatar_url)`)
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request, { params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert({ trip_id: tripId, sender_id: userId, text })
    .select(`*, sender:users(full_name, avatar_url)`)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
