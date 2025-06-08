import { z } from 'zod'
import { db } from '@/db'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import { agents } from '@/db/schema'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { agentInsertSchema } from '../schemas'
import { TRPCError } from '@trpc/server'

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db
      .select({
        meetingCount: sql<number>`COUNT(${agents.id})`.as('meetingCount'),
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(eq(agents.id, input.id))
    if (!existingAgent) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' })
    }
    return existingAgent
  }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db.select().from(agents).where(eq(agents.userId, ctx.auth.user.id))
    return data
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
