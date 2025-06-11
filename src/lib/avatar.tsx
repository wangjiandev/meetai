import { botttsNeutral, initials } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

interface AvatarProps {
  seed: string
  variant: 'botttsNeutral' | 'initials'
}

export const generateAvatarUri = ({ seed, variant }: AvatarProps) => {
  let avatar

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, {
      seed,
    })
  } else if (variant === 'initials') {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    })
  }

  return avatar?.toDataUri()!
}
