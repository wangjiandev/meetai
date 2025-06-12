'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { generateAvatarUri } from '@/lib/avatar'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'

interface TranscriptProps {
  meetingId: string
}

const Transcript = ({ meetingId }: TranscriptProps) => {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }))
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = (data ?? []).filter((item) => item.text.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="roundedlg flex w-full flex-col gap-y-4 border bg-white px-4 py-5">
      <p className="text-sm font-medium">Transcript</p>
      <div className="relative">
        <Input
          placeholder="search transcript"
          className="h-9 w-[240px] pl-7"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
      </div>
      <ScrollArea>
        <div className="flex flex-col gap-y-4">
          {filteredData.map((item) => (
            <div key={item.start_ts} className="hover:bg-muted flex flex-col gap-y-2 rounded-md border p-4">
              <div className="flex items-center gap-x-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={item.user.image ?? generateAvatarUri({ seed: item.user.name, variant: 'botttsNeutral' })}
                    alt={item.user.name}
                  />
                </Avatar>
                <p className="text-sm font-medium">{item.user.name}</p>
                <p className="text-sm font-medium text-blue-500">{format(new Date(item.start_ts), 'mm:ss')}</p>
              </div>
              <Highlighter
                className="text-sm text-neutral-700"
                autoEscape={true}
                searchWords={[searchQuery]}
                textToHighlight={item.text}
                highlightClassName="bg-yellow-200"
              />
            </div>
          ))}
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  )
}

export default Transcript
