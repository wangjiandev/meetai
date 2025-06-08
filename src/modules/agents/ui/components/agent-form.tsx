'use client'

import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { AgentGetOne } from '@/modules/agents/types'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { type AgentInsertSchema, agentInsertSchema } from '../../schemas'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface AgentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialValues?: AgentGetOne
}

const AgentForm = ({ initialValues, onSuccess, onCancel }: AgentFormProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions())
        if (initialValues?.id) {
          await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: initialValues.id }))
        }
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(error.message)
        // TODO: check if error is "FORBIDDEN" , redirect to "/upgrade"
      },
    }),
  )

  const form = useForm<AgentInsertSchema>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instructions: initialValues?.instructions ?? '',
    },
  })

  const isEdit = !!initialValues?.id
  const isPending = createAgent.isPending

  const onSubmit = (values: AgentInsertSchema) => {
    if (isEdit) {
      // TODO: update agent
      console.log('edit', values)
    } else {
      createAgent.mutate(values)
    }
  }
  return (
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
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful match assistant that can help users find the best matches for their needs."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
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
  )
}

export default AgentForm
