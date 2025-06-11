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

export const CallEnded = () => {
  return (
    <div className="from-primary to-primary/10 flex h-full flex-col items-center justify-center bg-radial">
      <div className="flex flex-1 items-center justify-center px-8 py-4">
        <div className="bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Call Ended</h6>
            <p className="text-sm">The call has ended</p>
          </div>
          <Button asChild>
            <Link href="/meetings">Back to Meetings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
