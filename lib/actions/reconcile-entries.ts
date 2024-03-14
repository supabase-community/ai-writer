"use server"

import { createClient } from "@/supabase/server"

import type { Entry } from "@/components/EntryProvider"

export const reconcileEntries = async (localEntries: Entry[]) => {
  console.log("reconciling local entries with server")
  console.log("localEntries: ", localEntries)
  const supabase = createClient()
  const { data, error } = await supabase.rpc("reconcile_entries", {
    local_entries: localEntries,
  })
  if (error) console.error(error)

  return { data, error }
}
