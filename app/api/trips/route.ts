import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function getUserId() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .select(`*, host:users(full_name, avatar_url, rating, hostel, upi_id)`)
    .eq('status', 'active')
    .order('departure_time', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { store, location, departure_time, slots_total, notes, type } = body

  const { data, error } = await supabaseAdmin.from('trips').insert({
    host_id: userId,
    store,
    location,
    departure_time,
    slots_total,
    notes,
    type,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
