'use client'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import AgentIdViewHeader from '../components/agent-id-view-header'
import GeneratorAvatar from '@/components/generator-avatar'
import { Badge } from '@/components/ui/badge'
import { VideoIcon } from 'lucide-react'

interface AgentIdViewProps {
  agentId: string
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))

  return (
    <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
      <AgentIdViewHeader agentId={agentId} agentName={data.name} onEdit={() => {}} onRemove={() => {}} />
      <div className="rounded-md border bg-white">
        <div className="col-span-5 flex flex-col gap-y-5 px-4 py-5">
          <div className="flex items-center gap-x-3">
            <GeneratorAvatar seed={data.name} variant="botttsNeutral" className="size-10" />
            <h2 className="text-lg font-medium">{data.name}</h2>
          </div>
          <Badge variant="outline" className="flex items-center gap-x-2">
            <VideoIcon className="size-4" />
            {data.meetingCount} {data.meetingCount === 1 ? 'Meeting' : 'Meetings'}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-muted-foreground text-sm">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const AgentIdViewLoading = () => {
  return <LoadingState title="Loading agent" description="Please wait while we load the agent" />
}

export const AgentIdViewError = () => {
  return <ErrorState title="Error loading agent" description="Please try again later" />
}
