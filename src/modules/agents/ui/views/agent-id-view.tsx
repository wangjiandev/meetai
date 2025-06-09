'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'
import { useTRPC } from '@/trpc/client'
import { useQueryClient, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import AgentIdViewHeader from '../components/agent-id-view-header'
import GeneratorAvatar from '@/components/generator-avatar'
import { Badge } from '@/components/ui/badge'
import { VideoIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useConfirm } from '@/hooks/use-confirm'
import UpdateAgentDialog from '../components/update-agent-dialog'

interface AgentIdViewProps {
  agentId: string
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))
  const queryClient = useQueryClient()
  const [openUpdateAgentDialog, setOpenUpdateAgentDialog] = useState(false)

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        router.push('/agents')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const [ConfirmDialog, confirm] = useConfirm('Remove agent', 'Are you sure you want to remove this agent?')

  const handleRemove = async () => {
    const confirmed = await confirm()
    if (!confirmed) return
    removeAgent.mutate({ id: agentId })
  }

  return (
    <>
      <ConfirmDialog />
      <UpdateAgentDialog open={openUpdateAgentDialog} onOpenChange={setOpenUpdateAgentDialog} initialValues={data} />
      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setOpenUpdateAgentDialog(true)}
          onRemove={handleRemove}
        />
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
    </>
  )
}

export const AgentIdViewLoading = () => {
  return <LoadingState title="Loading agent" description="Please wait while we load the agent" />
}

export const AgentIdViewError = () => {
  return <ErrorState title="Error loading agent" description="Please try again later" />
}
