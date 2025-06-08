'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { BotIcon, StarIcon, VideoIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
} from '@/components/ui/sidebar'
import AppUserButton from './app-user-button'

const firstSection = [
  {
    icon: VideoIcon,
    label: 'Meetings',
    href: '/meetings',
  },
  {
    icon: BotIcon,
    label: 'Agents',
    href: '/agents',
  },
]

const secondSection = [
  {
    icon: StarIcon,
    label: 'Upgrade',
    href: '/upgrade',
  },
]

const AppSiderbar = () => {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex h-8 items-center justify-center">
          <Image src="/next.svg" alt="Agent" width={100} height={100} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      pathname === item.href &&
                        'bg-sidebar-accent text-sidebar-primary hover:text-sidebar-primary font-bold',
                    )}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      pathname === item.href &&
                        'bg-sidebar-accent text-sidebar-primary hover:text-sidebar-primary font-bold',
                    )}>
                    <a href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppUserButton />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSiderbar
