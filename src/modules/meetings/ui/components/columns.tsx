'use client'

import { format } from 'date-fns'
import humanizeDuration from 'humanize-duration'

import { ColumnDef } from '@tanstack/react-table'
import {
  CornerDownRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  LoaderIcon,
} from 'lucide-react'
import GeneratorAvatar from '@/components/generator-avatar'
import { Badge } from '@/components/ui/badge'
import { MeetingsGetMany } from '../../types'
import { cn } from '@/lib/utils'

function formatDuration(duration: number) {
  return humanizeDuration(duration * 1000, {
    language: 'en',
    largest: 1,
    round: true,
    units: ['d', 'h', 'm', 's'],
  })
}

const statusIconMap = {
  upcoming: ClockFadingIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: ClockArrowUpIcon,
  cancelled: CircleXIcon,
}

const statusColorMap = {
  upcoming: 'bg-yellow-500/20 text-yellow-500 border-yellow-800/5',
  active: 'bg-blue-500/20 text-blue-500 border-blue-800/5',
  completed: 'bg-emerald-500/20 text-emerald-500 border-emerald-800/5',
  processing: 'bg-rose-500/20 text-rose-500 border-rose-800/5',
  cancelled: 'bg-gray-500/20 text-gray-500 border-gray-800/5',
}

export const columns: ColumnDef<MeetingsGetMany[number]>[] = [
  {
    accessorKey: 'name',
    header: 'Meeting Name',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-1">
          <span className="font-semibold capitalize">{row.original.name}</span>
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1">
              <CornerDownRightIcon className="text-muted-foreground size-3" />
              <span className="text-muted-foreground max-w-[200px] truncate text-sm capitalize">
                {row.original.agent?.name}
              </span>
            </div>
            <GeneratorAvatar seed={row.original.agent?.name ?? ''} variant="botttsNeutral" className="size-6" />
            <span className="text-muted-foreground text-sm capitalize">
              {row.original.startedAt ? format(row.original.startedAt, 'MMM d') : ''}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const StatusIcon = statusIconMap[row.original.status]
      const StatusColor = statusColorMap[row.original.status]
      return (
        <Badge variant="outline" className={cn('text-muted-foreground capitalize [&>svg]:size-4', StatusColor)}>
          <StatusIcon className={cn(row.original.status === 'processing' && 'animate-spin')} />
          {row.original.status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="flex items-center gap-x-2 capitalize">
          <ClockFadingIcon className="text-blue-700" />
          {row.original.duration ? formatDuration(row.original.duration) : 'no duration'}
        </Badge>
      )
    },
  },
]
