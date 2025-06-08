import Image from 'next/image'

interface EmptyStateProps {
  title: string
  description: string
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <Image src="/empty.svg" alt="Empty state" width={240} height={240} />
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-y-6 text-center">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}

export default EmptyState
