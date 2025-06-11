import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { generateAvatarUri } from '@/lib/avatar'
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk'

import '@stream-io/video-react-sdk/dist/css/styles.css'
import { LogInIcon } from 'lucide-react'
import Link from 'next/link'

interface CallLobbyProps {
  onJoin: () => void
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession()
  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user?.name ?? '',
          image: data?.user?.image ?? generateAvatarUri({ seed: data?.user.name ?? '', variant: 'botttsNeutral' }),
        } as StreamVideoParticipant
      }
    />
  )
}

const AllowBrowserPermissions = () => {
  return <p className="text-sm">Please grant your browser a permission to access your camera and microphone.</p>
}

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks()

  const { hasBrowserPermission: hasCameraPermission } = useCameraState()
  const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState()

  const hasBrowserMediaPermissions = hasCameraPermission && hasMicrophonePermission

  return (
    <div className="from-primary to-primary/10 flex h-full flex-col items-center justify-center bg-radial">
      <div className="flex flex-1 items-center justify-center px-8 py-4">
        <div className="bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm">set up your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={hasBrowserMediaPermissions ? DisabledVideoPreview : AllowBrowserPermissions}
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex w-full justify-between gap-x-2">
            <Button asChild variant="ghost">
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogInIcon />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
