import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { signIn } from "@/lib/actions/sign-in"
import { signUp } from "@/lib/actions/sign-up"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignIn({
  searchParams,
}: {
  searchParams: { message: string }
}) {
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
