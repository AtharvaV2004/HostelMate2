import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

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
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Safety Sync: Ensure user exists in public.users to prevent FK errors
  // This is a backup for the database trigger
  const { data: userExists } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (!userExists && user) {
    await supabaseAdmin.from('users').insert({
      id: userId,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      hostel: user.user_metadata?.hostel || 'Hostel 1',
      room_no: user.user_metadata?.room_no || '',
      avatar_url: user.user_metadata?.avatar_url || `https://picsum.photos/seed/${userId}/100/100`
    })
  }

  const body = await req.json()
  const { store, location, departure_time, slots_total, notes, type } = body

  const { data, error } = await supabaseAdmin.from('trips').insert({
    host_id: userId,
    store,
    location,
    departure_time,
    slots_total,
    notes,
    type: type || 'Quick',
  }).select().single()

  if (error) {
    console.error('Trip Creation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data, { status: 201 })
}
