import { cookies, headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import { ChevronLeft } from "lucide-react"
import * as v from "valibot"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LoginSchema = v.object({
  email: v.string("Your email must be a string.", [
    v.minLength(1, "Please enter your email."),
    v.email("Please enter a valid email address."),
  ]),
  password: v.string("Your password must be a string.", [
    v.minLength(1, "Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
  ]),
})

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate the form data
    try {
      v.parse(LoginSchema, { email, password })
      // Handle errors if one occurs
    } catch (error) {
      if (error instanceof v.ValiError) {
        const message = error.message
        return redirect(`/login?message=${message}`)
      }
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect("/login?message=Could not authenticate user")
    }

    return redirect("/")
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect("/login?message=Could not authenticate user")
    }

    return redirect("/login?message=Check email to continue sign in process")
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
          action={signIn}
        >
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="mb-2"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            className="mb-2"
          />
          <Button>Sign In</Button>
          <Button formAction={signUp} variant="outline">
            Sign Up
          </Button>
          {searchParams.message && (
            <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
