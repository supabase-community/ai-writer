"use client"

import { useEffect } from "react"

import { signOut } from "@/lib/actions/sign-out"
import { EditorSkeleton } from "@/components/EditorSkeleton"
import { useEntries } from "@/components/EntryProvider"

export function SignOut() {
  const { setSession } = useEntries()
  useEffect(() => {
    async function signOutUser() {
      await signOut()
      setSession(null)
    }
    signOutUser()
  }, [])
  return <EditorSkeleton />
}
