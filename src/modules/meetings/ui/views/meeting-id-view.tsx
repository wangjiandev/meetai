'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'
import { useTRPC } from '@/trpc/client'
import { useQueryClient, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useConfirm } from '@/hooks/use-confirm'

import MeetingIdViewHeader from '../components/meeting-id-view-header'
import UpdateMeetingDialog from '../components/update-meeting-dialog'
import { UpcomingState } from '../components/upcoming-state'
import { ActiveState } from '../components/active-state'
import { CancelledState } from '../components/cancelled-state'
import { ProcessingState } from '../components/processing-state'
import { CompletedState } from '../components/completed-state'

interface MeetingIdViewProps {
  meetingId: string
}

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))
  const queryClient = useQueryClient()
  const [openUpdateMeetingDialog, setOpenUpdateMeetingDialog] = useState(false)

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
        router.push('/meetings')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const [ConfirmDialog, confirm] = useConfirm('Remove meeting', 'Are you sure you want to remove this meeting?')

  const handleRemove = async () => {
    const confirmed = await confirm()
    if (!confirmed) return
    await removeMeeting.mutateAsync({ id: meetingId })
  }

  const isActive = data.status === 'active'
  const isUpcoming = data.status === 'upcoming'
  const isCancelled = data.status === 'cancelled'
  const isCompleted = data.status === 'completed'
  const isProcessing = data.status === 'processing'

  return (
    <>
      <ConfirmDialog />
      <UpdateMeetingDialog
        open={openUpdateMeetingDialog}
        onOpenChange={setOpenUpdateMeetingDialog}
        initialValues={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setOpenUpdateMeetingDialog(true)}
          onRemove={handleRemove}
        />
        {isCancelled && <CancelledState />}
        {isCompleted && <CompletedState data={data} />}
        {isProcessing && <ProcessingState />}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && (
          <UpcomingState meetingId={meetingId} onCancelMeeting={handleRemove} isCancelling={removeMeeting.isPending} />
        )}
      </div>
    </>
  )
}

export const MeetingIdViewLoading = () => {
  return <LoadingState title="Loading meeting" description="Please wait while we load the meeting" />
}

export const MeetingIdViewError = () => {
  return <ErrorState title="Error loading meeting" description="Please try again later" />
}
