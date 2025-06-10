import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface DataPaginationProps {
  totalPages: number
  page: number
  onPageChange: (page: number) => void
}

const DataPagination = ({ totalPages, page, onPageChange }: DataPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex-1 text-sm">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          <ChevronLeftIcon className="size-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
          Next
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default DataPagination
