"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import * as v from "valibot"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/supabase/client"

const signinSchema = v.object({
  email: v.string("Your email must be a string.", [
    v.minLength(1, "Please enter your email."),
    v.email("Please enter a valid email address."),
  ]),
  password: v.string("Your password must be a string.", [
    v.minLength(1, "Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
  ]),
})

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  const supabase = createClient()
  const [isSignIn, setIsSignIn] = useState(true)

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Extract form data from the event
    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string).trim()
    const password = (formData.get("password") as string).trim()
    // Validate the form data
    try {
      v.parse(signinSchema, { email, password })
      // Handle errors if one occurs
    } catch (error) {
      if (error instanceof v.ValiError) {
        const message = error.message
        return window.history.pushState(null, "", `?message=${message}`)
      }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return window.history.pushState(
        null,
        "",
        "?message=Could not authenticate user, please check your password and verify you have created an account"
      )
    }

    return router.push("/")
  }

  const signUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Extract form data from the event
    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string).trim()
    const password = (formData.get("password") as string).trim()
    // Validate the form data
    try {
      v.parse(signinSchema, { email, password })
      // Handle errors if one occurs
    } catch (error) {
      if (error instanceof v.ValiError) {
        const message = error.message
        return window.history.pushState(null, "", `?message=${message}`)
      }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return window.history.pushState(
        null,
        "",
        "?message=Could not create user, please try again later"
      )
    }

    if (data.user) {
      return router.push("/")
    }
  }

  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group absolute left-8 top-8 no-underline"
          )}
        >
          <ChevronLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Link>
        <form
          className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
          onSubmit={isSignIn ? signIn : signUp}
        >
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="mb-2"
            autoComplete="email"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="mb-2"
            autoComplete="password"
          />
          <Button onClick={() => setIsSignIn(true)}>Sign In</Button>
          <Button onClick={() => setIsSignIn(false)} variant="outline">
            Sign Up
          </Button>
          {message && (
            <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
