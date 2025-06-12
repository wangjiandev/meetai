import { z } from 'zod'
import { db } from '@/db'
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from 'drizzle-orm'
import { agents, meetings, user } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE, MIN_PAGE } from '@/constants'

import { meetingInsertSchema, meetingUpdateSchema } from '../schemas'
import { MeetingStatus, StreamTranscriptItem } from '../types'
import { streamVideo } from '@/lib/stream-video'
import { generateAvatarUri } from '@/lib/avatar'
import JSONL from 'jsonl-parse-stringify'

export const meetingsRouter = createTRPCRouter({
  getTranscript: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))

    if (!meeting) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })
    }

    if (!meeting.transcriptUrl) {
      return []
    }

    const transcript = await fetch(meeting.transcriptUrl)
      .then((res) => res.text())
      .then((text) => JSONL.parse<StreamTranscriptItem>(text))
      .catch(() => [])

    const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))]

    const speakers = await db
      .select()
      .from(user)
      .where(inArray(user.id, speakerIds))
      .then((users) =>
        users.map((user) => ({
          ...user,
          image: user.image ?? generateAvatarUri({ seed: user.name, variant: 'botttsNeutral' }),
        })),
      )

    const agentSpeakers = await db
      .select()
      .from(agents)
      .where(inArray(agents.id, speakerIds))
      .then((agents) =>
        agents.map((agent) => ({
          ...agent,
          image: generateAvatarUri({ seed: agent.name, variant: 'botttsNeutral' }),
        })),
      )

    const allSpeakers = [...speakers, ...agentSpeakers]

    const transcriptWithSpeakers = transcript.map((item) => {
      const speaker = allSpeakers.find((speaker) => speaker.id === item.speaker_id)
      if (!speaker) {
        return {
          ...item,
          user: {
            name: 'Unknown',
            image: generateAvatarUri({ seed: 'Unknown', variant: 'botttsNeutral' }),
          },
        }
      }

      return {
        ...item,
        user: {
          name: speaker.name,
          image: speaker.image,
        },
      }
    })

    return transcriptWithSpeakers
  }),
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: 'admin',
        image: generateAvatarUri({ seed: ctx.auth.user.id, variant: 'botttsNeutral' }),
      },
    ])

    const expirationTime = Math.floor(Date.now() / 1000) + 3600
    const issuedAt = Math.floor(Date.now() / 1000) - 60

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    })

    return token
  }),
  update: protectedProcedure.input(meetingUpdateSchema).mutation(async ({ input, ctx }) => {
    const [updatedMeeting] = await db
      .update(meetings)
      .set(input)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
      .returning()

    if (!updatedMeeting) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })
    }

    return updatedMeeting
  }),
  remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const [removedMeeting] = await db
      .delete(meetings)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))
      .returning()

    if (!removedMeeting) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })
    }

    return removedMeeting
  }),
  create: protectedProcedure.input(meetingInsertSchema).mutation(async ({ input, ctx }) => {
    const [createdMeeting] = await db
      .insert(meetings)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning()

    const call = streamVideo.video.call('default', createdMeeting.id)
    await call.create({
      data: {
        created_by_id: ctx.auth.user.id,
        custom: {
          meetingId: createdMeeting.id,
          meetingName: createdMeeting.name,
        },
        settings_override: {
          transcription: {
            language: 'en',
            mode: 'auto-on',
            closed_caption_mode: 'auto-on',
          },
          recording: {
            mode: 'auto-on',
            quality: '1080p',
          },
        },
      },
    })

    const [existingAgent] = await db.select().from(agents).where(eq(agents.id, createdMeeting.agentId))

    if (!existingAgent) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
    }

    await streamVideo.upsertUsers([
      {
        id: existingAgent.id,
        name: existingAgent.name,
        image: generateAvatarUri({ seed: existingAgent.id, variant: 'botttsNeutral' }),
        role: 'user',
      },
    ])

    return createdMeeting
  }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingMeeting] = await db
      .select({
        ...getTableColumns(meetings),
        agent: agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)))

    if (!existingMeeting) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not found' })
    }

    return existingMeeting
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(MIN_PAGE).default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.nativeEnum(MeetingStatus).nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, agentId, status } = input
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as('duration'),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
            status ? eq(meetings.status, status) : undefined,
          ),
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined,
            status ? eq(meetings.status, status) : undefined,
          ),
        )

      const totalPages = Math.ceil(total.count / pageSize)

      return {
        totalPages,
        total: total.count,
        items: data,
      }
    }),
})
