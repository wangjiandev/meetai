import { db } from '@/db'
import { agents, meetings, user } from '@/db/schema'
import { inngest } from '@/inngest/client'
import { createAgent, openai, TextMessage } from '@inngest/agent-kit'
import type { StreamTranscriptItem } from '@/modules/meetings/types'
import { eq, inArray } from 'drizzle-orm'
import JSONL from 'jsonl-parse-stringify'

const summarizer = createAgent({
  name: 'summarizer',
  system:
    `You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z`.trim(),
  model: openai({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY!,
    baseUrl: 'https://api.deepseek.com/v1',
  }),
})

export const meetingProcessing = inngest.createFunction(
  { id: 'meetings/processing' },
  { event: 'meetings/processing' },
  async ({ event, step }) => {
    const response = await step.run('fetch-transcript', async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text())
    })
    const transcript = await step.run('parse-transcript', async () => {
      return JSONL.parse<StreamTranscriptItem>(response)
    })
    const transcriptWithSpeaker = await step.run('add-speakers', async () => {
      const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))]
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          })),
        )

      const agentsSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          })),
        )

      const speakers = [...userSpeakers, ...agentsSpeakers]

      return transcript.map((item) => {
        const speaker = speakers.find((speaker) => speaker.id === item.speaker_id)
        if (!speaker) {
          return {
            ...item,
            user: {
              name: 'Unknown',
            },
          }
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        }
      })
    })

    const { output } = await summarizer.run(
      'Summarize the following transcript: ' + JSON.stringify(transcriptWithSpeaker),
    )

    console.log('output: ', output)

    if ((output[0] as TextMessage).content) {
      await step.run('save-summary', async () => {
        return db
          .update(meetings)
          .set({
            summary: (output[0] as TextMessage).content as string,
            status: 'completed',
          })
          .where(eq(meetings.id, event.data.meetingId))
      })
    }
  },
)
