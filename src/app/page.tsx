'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { data: session } = authClient.useSession()

  const handleSignUp = async () => {
    const res = await authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: (data) => {
          console.log(data)
        },
        onError: (error) => {
          console.log(error)
        },
      },
    )
  }

  const handleSignIn = async () => {
    authClient.signIn.email(
      { email, password },
      {
        onSuccess: (data) => {
          console.log(data)
        },
        onError: (error) => {
          console.log(error)
        },
      },
    )
  }

  const handleSignOut = async () => {
    authClient.signOut()
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4">
      {session && (
        <Card className="w-96">
          <CardContent className="flex flex-col gap-4">
            <p>Name: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </CardContent>
        </Card>
      )}

      <Card className="w-96">
        <CardContent className="flex flex-col gap-4">
          <Input type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSignUp}>Sign Up</Button>
        </CardContent>
      </Card>

      <Card className="w-96">
        <CardContent className="flex flex-col gap-4">
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleSignIn}>Sign In</Button>
        </CardContent>
      </Card>
    </div>
  )
}
