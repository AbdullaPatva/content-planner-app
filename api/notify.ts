import type {NextRequest} from 'sanity/runtime'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2025-07-15',
  token: process.env.SANITY_API_READ_TOKEN!,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  // body should contain documentId + action
  const {documentId, action} = body as {documentId: string; action: 'publish' | 'reminder'}

  // read config singleton
  const cfg = await client.fetch<{slackWebhookUrl: string | null}>(
    '*[_id == "planner.config"][0]{slackWebhookUrl}',
  )
  if (!cfg?.slackWebhookUrl) {
    return new Response(JSON.stringify({ok: false, error: 'No webhook set'}), {status: 200})
  }

  await fetch(cfg.slackWebhookUrl, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      text: `📅 Planner — ${action} fired for document <https://sanity.io/docs/${documentId}|${documentId}>`,
    }),
  })

  return new Response(JSON.stringify({ok: true}))
}
