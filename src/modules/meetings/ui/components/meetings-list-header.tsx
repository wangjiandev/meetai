'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import NewMeetingDialog from './new-meeting-dialog'
import { useState } from 'react'
import { MeetingsSearchFilter } from './meetings-search-filter'
import StatusFilter from './status-filter'
import AgentIdFilter from './agent-id-filter'
import { useMeetingFilters } from '../../hooks/use-meeting-filters'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { DEFAULT_PAGE } from '@/constants'

const MeetingsListHeader = () => {
  const [open, setOpen] = useState(false)
  const { agentId, status, search, setAgentId, setStatus, setSearch, setPage } = useMeetingFilters()
  const isAnyFilterModified = !!agentId || !!status || !!search

  const clearFilters = () => {
    setStatus(null)
    setAgentId('')
    setSearch('')
    setPage(DEFAULT_PAGE)
  }

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
        <ScrollArea>
          <div className="flex h-12 items-center gap-x-2 pl-2">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button variant="outline" onClick={clearFilters}>
                <XCircleIcon className="size-4" />
                Clear Filters
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  )
}

export default MeetingsListHeader
