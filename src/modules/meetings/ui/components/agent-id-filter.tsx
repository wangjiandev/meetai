'use client'

import GeneratorAvatar from '@/components/generator-avatar'
import { useMeetingFilters } from '../../hooks/use-meeting-filters'
import CommandSelect from '@/components/command-select'

import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const AgentIdFilter = () => {
  const { agentId, setAgentId } = useMeetingFilters()

  const [agentSearch, setAgentSearch] = useState('')
  const trpc = useTRPC()
  const { data: agents } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  )

  return (
    <CommandSelect
      placeholder="Agent"
      className="h-9"
      options={(agents?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratorAvatar seed={agent.name} variant="botttsNeutral" className="size-4" />
            <span className="truncate">{agent.name}</span>
          </div>
        ),
      }))}
      onSelect={(value) => setAgentId(value)}
      onSearch={setAgentSearch}
      value={agentId ?? ''}
    />
  )
}

export default AgentIdFilter
