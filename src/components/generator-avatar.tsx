'use client'

import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { bottts, botttsNeutral } from '@dicebear/collection'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface GeneratorAvatarProps {
  seed: string
  variant?: 'botttsNeutral' | 'bottts'
  className?: string
}

const GeneratorAvatar = ({ seed, variant = 'bottts', className }: GeneratorAvatarProps) => {
  const avatar = useMemo(() => {
    const collection = variant === 'botttsNeutral' ? botttsNeutral : bottts
    return createAvatar(collection, {
      seed,
    })
  }, [seed, variant])
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default GeneratorAvatar
