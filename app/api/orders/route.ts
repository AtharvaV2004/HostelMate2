import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
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

  // Increment slots_used on the trip
  await supabaseAdmin.rpc('increment_slots', { trip_id })

  return NextResponse.json(order, { status: 201 })
}
