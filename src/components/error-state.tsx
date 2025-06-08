import { AlertCircleIcon } from 'lucide-react'

interface ErrorStateProps {
  title: string
  description: string
}

const ErrorState = ({ title, description }: ErrorStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="bg-background/50 flex flex-col items-center justify-center gap-y-4 rounded-sm p-4">
        <AlertCircleIcon className="size-10 text-red-500" />
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorState
