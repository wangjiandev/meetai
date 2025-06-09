import { z } from 'zod'

export const agentInsertSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  instructions: z.string().min(1, { message: 'Instructions are required' }),
})

export const agentUpdateSchema = agentInsertSchema.extend({
  id: z.string().min(1, { message: 'ID is required' }),
})

export type AgentInsertSchema = z.infer<typeof agentInsertSchema>
export type AgentUpdateSchema = z.infer<typeof agentUpdateSchema>
