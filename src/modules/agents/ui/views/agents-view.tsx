'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import LoadingState from '@/components/loading-state'
import ErrorState from '@/components/error-state'
import { columns } from '../components/columns'
import EmptyState from '@/components/empty-state'
import { useAgentFilters } from '@/modules/agents/hooks/use-agent-filters'
import DataPagination from '../components/data-pagination'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-table'

export const AgentsView = () => {
  const router = useRouter()
  const { page, search, setPage } = useAgentFilters()

  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ page, search }))

  return (
    <div className="flex flex-1 flex-col gap-4 pb-4 md:px-8">
      <DataTable columns={columns} data={data.items} onRowClick={(row) => router.push(`/agents/${row.id}`)} />
      <DataPagination totalPages={data.totalPages} page={page} onPageChange={(page: number) => setPage(page)} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Agent"
          description="Create an agent to join your meetings. Each agent can have a different role and personality."
        />
      )}
    </div>
  )
}

export const AgentsViewLoading = () => {
  return <LoadingState title="Loading agents" description="Please wait while we load the agents" />
}

export const AgentsViewError = () => {
  return <ErrorState title="Error loading agents" description="Please try again later" />
}
