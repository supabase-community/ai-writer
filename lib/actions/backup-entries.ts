"use server"

import { createClient } from "@/supabase/server"

import type { Entry } from "@/components/EntryProvider"

export const backupEntries = async (localEntries: Entry[]) => {
  //console.log("updating entries on the server")
  console.log("localEntries: ", localEntries)
  const supabase = createClient()
  const { data, error } = await supabase.rpc("backup_entries", {
    local_entries: localEntries,
  })
  if (error) console.error(error)
  return { data, error }
}
