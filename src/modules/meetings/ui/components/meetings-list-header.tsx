'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import NewMeetingDialog from './new-meeting-dialog'
import { useState } from 'react'

const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <NewMeetingDialog open={open} onOpenChange={setOpen} />
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium">My Meetings</h5>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <PlusIcon className="size-4" />
            New Meeting
          </Button>
        </div>
        <div className="flex items-center gap-x-2"></div>
      </div>
    </>
  )
}

export default MeetingsListHeader
