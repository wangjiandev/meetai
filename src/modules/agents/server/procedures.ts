import { z } from 'zod'
import { db } from '@/db'
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { agents } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { agentInsertSchema } from '../schemas'
import { TRPCError } from '@trpc/server'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE, MIN_PAGE } from '@/constants'

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingAgent] = await db
      .select({
        meetingCount: sql<number>`5`,
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)))

    if (!existingAgent) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
    }

    return existingAgent
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(MIN_PAGE).default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input
      const data = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(and(eq(agents.userId, ctx.auth.user.id), search ? ilike(agents.name, `%${search}%`) : undefined))
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(and(eq(agents.userId, ctx.auth.user.id), search ? ilike(agents.name, `%${search}%`) : undefined))

      const totalPages = Math.ceil(total.count / pageSize)

      return {
        totalPages,
        total: total.count,
        items: data,
      }
    }),
  create: protectedProcedure.input(agentInsertSchema).mutation(async ({ input, ctx }) => {
    const [createdAgent] = await db
      .insert(agents)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning()

    return createdAgent
  }),
})
