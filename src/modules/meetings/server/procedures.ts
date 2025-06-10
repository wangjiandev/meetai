import { z } from 'zod'
import { db } from '@/db'
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { agents, meetings } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE, MIN_PAGE } from '@/constants'

import { meetingInsertSchema, meetingUpdateSchema } from '../schemas'
import { MeetingStatus } from '../types'

export const meetingsRouter = createTRPCRouter({
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
