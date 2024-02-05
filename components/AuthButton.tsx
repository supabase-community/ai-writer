"use server"

import { cookies } from "next/headers"
import Link from "next/link"
import { createClient } from "@/supabase/server"

import { signOut } from "@/lib/actions/sign-out"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session ? (
    <form action={signOut}>
      <Button size="sm">Sign Out</Button>
    </form>
  ) : (
    <Link href="/signin" className={cn(buttonVariants({ size: "sm" }))}>
      Sign In
    </Link>
  )
}
