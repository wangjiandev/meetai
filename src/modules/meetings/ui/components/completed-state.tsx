import GeneratorAvatar from '@/components/generator-avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MeetingGetOne } from '@/modules/meetings/types'
import { format } from 'date-fns'
import Markdown from 'react-markdown'
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, SparkleIcon, SparklesIcon, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import { formatDuration } from '@/lib/utils'
import Transcript from './transcript'

interface CompletedStateProps {
  data: MeetingGetOne
}

export const CompletedState = ({ data }: CompletedStateProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="rounded-lg border bg-white px-3">
          <ScrollArea>
            <TabsList className="bg-background h-14 items-center justify-start gap-x-4 rounded-none p-0">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none">
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none">
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none">
                <VideoIcon />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none">
                <SparkleIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="summary">
          <div className="rounded-lg border bg-white px-4 py-5">
            <div className="col-span-5 flex flex-col gap-y-5 px-4 py-5">
              <h2 className="text-2xl font-bold capitalize">{data.name}</h2>
              <div className="flex items-center gap-x-2">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 capitalize underline underline-offset-4">
                  <GeneratorAvatar variant="botttsNeutral" seed={data.agent.name} className="size-5" />
                  {data.agent.name}
                </Link>
                <p>{data.startedAt ? format(data.startedAt, 'PPP') : ''}</p>
              </div>
              <div className="flex items-center gap-x-2">
                <SparklesIcon className="size-4" />
                <p className="text-muted-foreground text-sm">Generated Summary by AI</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formatDuration(data.duration) : ''}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: ({ children }) => <h1 className="mb-6 text-2xl font-bold">{children}</h1>,
                    h2: ({ children }) => <h2 className="mb-4 text-xl font-bold">{children}</h2>,
                    h3: ({ children }) => <h3 className="mb-2 text-lg font-bold">{children}</h3>,
                    h4: ({ children }) => <h4 className="mb-2 text-base font-bold">{children}</h4>,
                    p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
                  }}>
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>
        <TabsContent value="recording">
          <div className="rounded-lg border bg-white px-4 py-5">
            <video src={data.recordingUrl!} className="w-full rounded-lg" controls />
          </div>
        </TabsContent>
        <TabsContent value="chat">chat</TabsContent>
      </Tabs>
    </div>
  )
}
