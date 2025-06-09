import { MeetingsView, MeetingsViewLoading, MeetingsViewError } from '@/modules/meetings/ui/views/meetings-view'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

const Page = async () => {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <ErrorBoundary fallback={<MeetingsViewError />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page
