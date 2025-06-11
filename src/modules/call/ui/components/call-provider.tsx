'use client'

import { authClient } from '@/lib/auth-client'
import { LoaderIcon } from 'lucide-react'

import CallConnect from './call-connect'
import { generateAvatarUri } from '@/lib/avatar'

interface CallProviderProps {
  meetingId: string
  meetingName: string
}

const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {
  const { data, isPending } = authClient.useSession()

  if (!data || isPending) {
    return (
      <div className="from-primary to-primary/50 flex h-screen items-center justify-center bg-radial">
        <LoaderIcon className="size-10 animate-spin text-white" />
      </div>
    )
  }
  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={data.user.image ?? generateAvatarUri({ seed: data.user.name, variant: 'initials' })}
    />
  )
}

export default CallProvider
