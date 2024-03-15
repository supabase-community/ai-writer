"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"

import { reconcileEntries } from "@/lib/actions/reconcile-entries"
import { EditorSkeleton } from "@/components/EditorSkeleton"
import { useEntries } from "@/components/EntryProvider"

export function Reconciler({ session }: { session: Session | null }) {
  const router = useRouter()
  const { entries, setEntries, setSession, setError } = useEntries()

  useEffect(() => {
    async function reconcile() {
      setSession(session)
      const { data, error } = await reconcileEntries(entries)
      if (error) setError(error)
      if (data) setEntries(data)
      router.push(`/?entry=${entries[0].id}`)
    }
    reconcile()
  }, [])

  return <EditorSkeleton />
}
