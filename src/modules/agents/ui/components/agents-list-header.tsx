'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon, XCircleIcon } from 'lucide-react'
import NewAgentDialog from './new-agent-dialog'
import { AgentsSearchFilter } from './agents-search-filter'
import { useAgentFilters } from '@/modules/agents/hooks/use-agent-filters'

import { DEFAULT_PAGE } from '@/constants'

const AgentsListHeader = () => {
  const { search, setSearch, setPage } = useAgentFilters()
  const [open, setOpen] = useState(false)

  const isAnyFilterModified = !!search

  const onClearFilters = () => {
    setSearch('')
    setPage(DEFAULT_PAGE)
  }

  return (
    <>
      <NewAgentDialog open={open} onOpenChange={setOpen} />
      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium">My Agents</h5>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <PlusIcon className="size-4" />
            New Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <AgentsSearchFilter />
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClearFilters}>
              <XCircleIcon className="size-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default AgentsListHeader
