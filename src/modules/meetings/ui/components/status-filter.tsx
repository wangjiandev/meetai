import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, ClockFadingIcon, LoaderIcon } from 'lucide-react'
import { MeetingStatus } from '../../types'
import { useMeetingFilters } from '../../hooks/use-meeting-filters'
import CommandSelect from '@/components/command-select'

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockFadingIcon />
        {MeetingStatus.Upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon />
        {MeetingStatus.Active}
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon />
        {MeetingStatus.Completed}
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <ClockArrowUpIcon />
        {MeetingStatus.Processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon />
        {MeetingStatus.Cancelled}
      </div>
    ),
  },
]

const StatusFilter = () => {
  const { status, setStatus } = useMeetingFilters()

  return (
    <CommandSelect
      placeholder="Status"
      options={options}
      onSelect={(value) => setStatus(value as MeetingStatus)}
      value={status ?? ''}
    />
  )
}

export default StatusFilter
