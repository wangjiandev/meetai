import { MeetingsView, MeetingsViewLoading, MeetingsViewError } from '@/modules/meetings/ui/views/meetings-view'

import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import MeetingsListHeader from '@/modules/meetings/ui/components/meetings-list-header'
import type { SearchParams } from 'nuqs'
import { loadSearchParams } from '@/modules/meetings/params'

interface PageProps {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: PageProps) => {
  const { page, search, agentId, status } = await loadSearchParams(searchParams)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({
      page,
      agentId,
      status,
      search,
    }),
  )

  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
          <ErrorBoundary fallback={<MeetingsViewError />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default Page
