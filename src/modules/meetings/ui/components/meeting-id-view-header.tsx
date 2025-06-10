'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react'

interface MeetingIdViewHeaderProps {
  meetingId: string
  meetingName: string
  onEdit: () => void
  onRemove: () => void
}

const MeetingIdViewHeader = ({ meetingId, meetingName, onEdit, onRemove }: MeetingIdViewHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/meetings">My Meetings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{meetingName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Button variant="ghost" size="icon" onClick={onEdit} className="w-full justify-start">
              <PencilIcon className="size-4" />
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant="ghost" size="icon" onClick={onRemove} className="w-full justify-start">
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default MeetingIdViewHeader
