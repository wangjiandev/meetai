'use client'

import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk'
import { Link } from 'lucide-react'
import Image from 'next/image'

interface CallActiveProps {
  onLeave: () => void
  meetingName: string
}

const CallActive = ({ onLeave, meetingName }: CallActiveProps) => {
  return (
    <div className="flex h-full flex-col justify-between p-4 text-white">
      <div className="flex items-center gap-x-2 rounded-full bg-[#101213] p-4">
        <Link href="/" className="flex items-center justify-center rounded-full bg-white/10 p-1">
          <Image src="/next.svg" alt="logo" width={24} height={24} />
        </Link>
        <h4 className="text-base">{meetingName}</h4>
      </div>
      <SpeakerLayout />
      <div className="rounded-full bg-[#101213] p-4">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  )
}

export default CallActive
