"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"

import { cn } from "@/lib/utils"

import { useEntries } from "./EntryProvider"
import { Button, buttonVariants } from "./ui/button"

export default function AuthButton() {
  const supabase = createClient()
  const router = useRouter()
  const { session } = useEntries()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  return session ? (
    <form action={signOut}>
      <Button size="sm">Sign out</Button>
    </form>
  ) : (
    <Link href="/signin" className={cn(buttonVariants({ size: "sm" }))}>
      Sign in
    </Link>
  )
}
