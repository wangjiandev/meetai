import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  title: string
  description: string
}

const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="bg-background/50 flex flex-col items-center justify-center gap-y-4 rounded-sm p-4">
        <Loader2 className="text-primary size-10 animate-spin" />
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
