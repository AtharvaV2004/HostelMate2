import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  const { status } = await request.json()
  const { id } = params

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify the user is the host of the trip associated with this order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, trips(*)')
    .eq('id', id)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.trips.host_id !== user.id) {
    return NextResponse.json({ error: 'Only the host can update order status' }, { status: 403 })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
