'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import NewAgentDialog from './new-agent-dialog'

const AgentsListHeader = () => {
  const [open, setOpen] = useState(false)
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
      </div>
    </>
  )
}

export default AgentsListHeader
