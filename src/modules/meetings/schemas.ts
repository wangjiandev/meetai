import { z } from 'zod'

export const meetingInsertSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  agentId: z.string().min(1, { message: 'Agent ID is required' }),
})

export const meetingUpdateSchema = meetingInsertSchema.extend({
  id: z.string().min(1, { message: 'ID is required' }),
})

export type MeetingInsertSchema = z.infer<typeof meetingInsertSchema>
export type MeetingUpdateSchema = z.infer<typeof meetingUpdateSchema>
