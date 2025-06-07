'use client'

import Link from 'next/link'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon, Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is required' }),
})

function SignInView({ className, ...props }: React.ComponentProps<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null)
    setPending(true)
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: '/',
        rememberMe: true,
      },
      {
        onSuccess: () => {
          setPending(false)
        },
        onError: ({ error }) => {
          setPending(false)
          setError(error.message)
        },
      },
    )
  }

  const handleSocialLogin = (provider: 'github') => {
    setPending(true)
    authClient.signIn.social(
      { provider },
      {
        onSuccess: () => {
          setPending(false)
        },
        onError: ({ error }) => {
          setPending(false)
          setError(error.message)
        },
      },
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <div className="grid gap-3">
                    <Alert variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle>{error}</AlertTitle>
                      <AlertDescription>
                        <p>Please verify your email and password and try again.</p>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? <Loader2 className="size-4 animate-spin" /> : 'Login'}
                  </Button>
                  <Separator className="my-4" />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={pending}
                    onClick={() => handleSocialLogin('github')}>
                    <FaGithub className="size-4" />
                    Login with Github
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  )
}

export default SignInView
