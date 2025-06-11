import { NextRequest, NextResponse } from 'next/server'
import { streamVideo } from '@/lib/stream-video'
import { CallSessionEndedEvent, CallSessionParticipantLeftEvent } from '@stream-io/node-sdk'
import { agents, meetings } from '@/db/schema'
import { db } from '@/db'
import { and, eq, not } from 'drizzle-orm'

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature)
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-signature')
  const apiKey = request.headers.get('x-api-key')

  if (!signature || !apiKey) {
    return NextResponse.json({ error: 'Missing signature or api key' }, { status: 400 })
  }

  const body = await request.text()

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(body) as Record<string, unknown>
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const eventType = (payload as Record<string, unknown>)?.type

  console.log('Webhook received eventType ', eventType)

  if (eventType === 'call.session_started') {
    const event = payload as CallSessionEndedEvent
    const meetingId = event.call.custom?.meetingId

    if (!meetingId) {
      return NextResponse.json({ error: 'Missing meeting id' }, { status: 400 })
    }

    const [meeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, 'completed')),
          not(eq(meetings.status, 'active')),
          not(eq(meetings.status, 'cancelled')),
          not(eq(meetings.status, 'processing')),
        ),
      )

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }

    await db.update(meetings).set({ status: 'active', startedAt: new Date() }).where(eq(meetings.id, meetingId))

    const [existingAgent] = await db.select().from(agents).where(eq(agents.id, meeting.agentId))

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const call = streamVideo.video.call('default', meetingId)
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPEN_AI_KEY!,
      agentUserId: existingAgent.id,
    })
    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    })
  } else if (eventType === 'call.session_participant_left') {
    const event = payload as CallSessionParticipantLeftEvent
    const meetingId = event.call_cid.split(':')[1]

    if (!meetingId) {
      return NextResponse.json({ error: 'Missing meeting id' }, { status: 400 })
    }

    const call = streamVideo.video.call('default', meetingId)
    await call.end()
  }

  return NextResponse.json({ status: 'ok' })
}
