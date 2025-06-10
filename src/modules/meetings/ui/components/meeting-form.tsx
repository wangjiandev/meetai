'use client'

import { ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { MeetingGetOne } from '@/modules/meetings/types'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { type MeetingInsertSchema, meetingInsertSchema } from '../../schemas'
import CommandSelect from '@/components/command-select'
import GeneratorAvatar from '@/components/generator-avatar'
import Link from 'next/link'
import NewAgentDialog from '@/modules/agents/ui/components/new-agent-dialog'

interface MeetingFormProps {
  onSuccess?: (id?: string) => void
  onCancel?: () => void
  initialValues?: MeetingGetOne
}

const MeetingForm = ({ initialValues, onSuccess, onCancel }: MeetingFormProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false)
  const [agentSearch, setAgentSearch] = useState('')

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  )

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
        onSuccess?.(data.id)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
        if (initialValues?.id) {
          await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValues.id }))
        }
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const form = useForm<MeetingInsertSchema>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? '',
    },
  })

  const isEdit = !!initialValues?.id
  const isPending = createMeeting.isPending || updateMeeting.isPending

  const onSubmit = (values: MeetingInsertSchema) => {
    if (isEdit) {
      updateMeeting.mutate({ id: initialValues.id, name: values.name, agentId: values.agentId })
    } else {
      createMeeting.mutate(values)
    }
  }

  return (
    <>
      <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Robot 1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratorAvatar seed={agent.name} variant="botttsNeutral" className="size-6 border" />
                          <span className="font-semibold capitalize">{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you're looking for ?
                  <Button
                    variant="link"
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}>
                    Create a new agent
                  </Button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end gap-4">
            {onCancel && (
              <Button variant="outline" type="button" disabled={isPending} onClick={() => onCancel()}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

export default MeetingForm
