import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

async function getUserId() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export async function POST(req: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { trip_id, items } = await req.json()

  // Calculate total
  const total_price = items.reduce(
    (sum: number, item: { price: string; quantity: number }) =>
      sum + (parseFloat(item.price) || 0) * item.quantity,
    0
  )

  // Create the order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({ trip_id, requester_id: userId, total_price })
    .select().single()

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

  // Insert items
  const orderItems = items.map((item: { name: string; quantity: number; price: string }) => ({
    order_id: order.id,
    name: item.name,
    quantity: item.quantity,
    price: parseFloat(item.price) || null,
  }))

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems)
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  // Send an automated message to the trip chat
  const itemsSummary = items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')
  const messageText = `🎁 New Request: ${itemsSummary}`
  
  await supabaseAdmin.from('messages').insert({
    trip_id,
    sender_id: userId,
    text: messageText
  })

  // Increment slots_used on the trip
  await supabaseAdmin.rpc('increment_slots', { trip_id })

  return NextResponse.json(order, { status: 201 })
}
