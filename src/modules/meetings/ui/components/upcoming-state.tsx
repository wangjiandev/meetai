import EmptyState from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { BanIcon, VideoIcon } from 'lucide-react'
import Link from 'next/link'

interface UpcomingStateProps {
  meetingId: string
  onCancelMeeting: () => void
  isCancelling: boolean
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: UpcomingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-lg bg-white px-4 py-5">
      <EmptyState title="No upcoming meetings" description="You have no upcoming meetings" image="/upcoming.svg" />
      <div className="flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center">
        <Button variant="secondary" className="w-full lg:w-auto" onClick={onCancelMeeting} disabled={isCancelling}>
          <BanIcon className="size-4" />
          Cancel meeting
        </Button>
        <Button asChild className="w-full lg:w-auto" disabled={isCancelling}>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="size-4" />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  )
}
