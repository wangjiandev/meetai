import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useMeetingFilters } from '@/modules/meetings/hooks/use-meeting-filters'

export const MeetingsSearchFilter = () => {
  const { search, setSearch } = useMeetingFilters()
  return (
    <div className="relative">
      <Input
        placeholder="Filter by name"
        className="h-9 w-[200px] bg-white pl-7"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
    </div>
  )
}
