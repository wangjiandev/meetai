'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const HomeView = () => {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const handleSignOut = async () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in')
        },
      },
    })
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4">
      {!!session && (
        <Card className="w-96">
          <CardContent className="flex flex-col gap-4">
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default HomeView
