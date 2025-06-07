'use client'

import { authClient } from '@/lib/auth-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { CreditCardIcon, LogOutIcon } from 'lucide-react'

const AppUserButton = () => {
  const router = useRouter()
  const isMobile = useIsMobile()

  const { data, isPending } = authClient.useSession()

  if (isPending || !data) {
    return null
  }

  const handleSignOut = async () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        },
      },
    })
  }

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <div className="bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-md p-2">
            <Avatar>
              <AvatarImage src={data.user.image ?? ''} alt="avatar" />
              <AvatarFallback className="bg-primary text-primary-foreground h-8 w-8 rounded-full">
                {data.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="text-sm font-medium">{data.user.name}</div>
              <div className="text-muted-foreground text-xs">{data.user.email}</div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button variant="outline" onClick={() => {}} className="w-full">
              <CreditCardIcon className="size-4 text-black" />
              Billing
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOutIcon className="size-4 text-black" />
              Log out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-md p-2">
          <Avatar>
            <AvatarImage src={data.user.image ?? ''} alt="avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground h-8 w-8 rounded-full">
              {data.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-sm font-medium">{data.user.name}</div>
            <div className="text-muted-foreground text-xs">{data.user.email}</div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AppUserButton
