import { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { AgentsView, AgentsViewLoading, AgentsViewError } from '@/modules/agents/ui/views/agents-view'
import AgentsListHeader from '@/modules/agents/ui/components/agents-list-header'
import type { SearchParams } from 'nuqs'
import { loadSearchParams } from '@/modules/agents/params'

interface PageProps {
  searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: PageProps) => {
  const { page, search } = await loadSearchParams(searchParams)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({ page, search }))

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsViewLoading />}>
          <ErrorBoundary fallback={<AgentsViewError />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  )
}

export default Page
