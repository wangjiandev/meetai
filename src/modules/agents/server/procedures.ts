import { db } from '@/db'
import { agents } from '@/db/schema'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents)

    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // throw new TRPCError({
    //   code: 'INTERNAL_SERVER_ERROR',
    //   message: 'test error',
    // })
    return data
  }),
})
