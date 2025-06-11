'use client'

import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

interface CallViewProps {
  meetingId: string
}

const CallView = ({ meetingId }: CallViewProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

  return <div>CallView {data.name}</div>
}

export default CallView
