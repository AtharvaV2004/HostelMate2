import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return new Response('No webhook secret', { status: 500 })

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature)
    return new Response('Missing svix headers', { status: 400 })

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Error occured', { status: 400 })
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const email = email_addresses[0]?.email_address ?? ''
    const full_name = `${first_name ?? ''} ${last_name ?? ''}`.trim()

    const { error } = await supabaseAdmin.from('users').upsert({
      id,
      email,
      full_name,
      avatar_url: image_url,
    }, { onConflict: 'id' })

    if (error) {
      console.error('Error syncing user to Supabase:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  }

  if (evt.type === 'user.deleted') {
    const { error } = await supabaseAdmin.from('users').delete().eq('id', evt.data.id!)
    if (error) {
      console.error('Error deleting user from Supabase:', error)
      return new Response('Error deleting user', { status: 500 })
    }
  }

  return new Response('OK', { status: 200 })
}
