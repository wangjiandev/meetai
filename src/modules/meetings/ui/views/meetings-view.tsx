'use client'

import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { columns } from '../components/columns'
import EmptyState from '@/components/empty-state'
import DataPagination from '@/components/data-pagination'

import { useMeetingFilters } from '../../hooks/use-meeting-filters'

export const MeetingsView = () => {
  const router = useRouter()
  const { page, agentId, status, search, setPage } = useMeetingFilters()

  const trpc = useTRPC()
  const { data } = useQuery(
    trpc.meetings.getMany.queryOptions({
      page,
      agentId,
      status,
      search,
    }),
  )
  return (
    <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
      <DataTable data={data?.items ?? []} columns={columns} onRowClick={(row) => router.push(`/meetings/${row.id}`)} />
      <DataPagination totalPages={data?.totalPages ?? 0} page={page} onPageChange={setPage} />
      {data?.items.length === 0 && (
        <EmptyState
          title="Create your first Meeting"
          description="Create a meeting to start a new conversation. Each meeting can have a different agent and personality."
        />
      )}
    </div>
  )
}

export const MeetingsViewLoading = () => {
  return <LoadingState title="Loading meetings" description="Please wait while we load the meetings" />
}

export const MeetingsViewError = () => {
  return <ErrorState title="Error loading meetings" description="Please try again later" />
}
