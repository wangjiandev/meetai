import EmptyState from '@/components/empty-state'

export const CancelledState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-lg bg-white px-4 py-5">
      <EmptyState title="Meeting is cancelled" description="You can't join the meeting" image="/cancelled.svg" />
    </div>
  )
}
