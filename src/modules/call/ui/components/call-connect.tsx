'use client'

import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'
import { LoaderIcon } from 'lucide-react'

import '@stream-io/video-react-sdk/dist/css/styles.css'

import CallUI from './call-ui'

interface CallConnectProps {
  meetingId: string
  meetingName: string
  userId: string
  userName: string
  userImage: string
}

const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: CallConnectProps) => {
  const trpc = useTRPC()
  const { mutateAsync: generateToken } = useMutation(trpc.meetings.generateToken.mutationOptions())
  const [client, setClient] = useState<StreamVideoClient>()
  const [call, setCall] = useState<Call>()

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    })

    setClient(_client)

    return () => {
      _client.disconnectUser()
      setClient(undefined)
    }
  }, [userId, userName, userImage, generateToken])

  useEffect(() => {
    if (!client) return
    const _call = client.call('default', meetingId)
    _call.camera.disable()
    _call.microphone.disable()
    setCall(_call)

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave()
        _call.endCall()
        setCall(undefined)
      }
    }
  }, [client, meetingId])

  if (!client || !call) {
    return (
      <div className="from-primary to-primary/50 flex h-screen items-center justify-center bg-radial">
        <LoaderIcon className="size-10 animate-spin text-white" />
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  )
}

export default CallConnect
