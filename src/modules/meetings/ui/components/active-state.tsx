import EmptyState from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { VideoIcon } from 'lucide-react'
import Link from 'next/link'

interface ActiveStateProps {
  meetingId: string
}

export const ActiveState = ({ meetingId }: ActiveStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-lg bg-white px-4 py-5">
      <EmptyState title="Meeting is active" description="You can join the meeting" image="/upcoming.svg" />
      <div className="flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="size-4" />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  )
}
