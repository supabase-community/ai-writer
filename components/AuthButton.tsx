"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

import { useEntries } from "./EntryProvider"
import { Button, buttonVariants } from "./ui/button"

export default function AuthButton() {
  const router = useRouter()
  const { session } = useEntries()

  return session ? (
    <Button size="sm" onClick={() => router.push("/signout")}>
      Sign Out
    </Button>
  ) : (
    <Link href="/signin" className={cn(buttonVariants({ size: "sm" }))}>
      Sign In
    </Link>
  )
}
