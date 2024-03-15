"use server"

import { createClient } from "@/supabase/server"

import type { Entry } from "@/components/EntryProvider"

export const backupEntry = async (localEntry: Entry) => {
  const supabase = createClient()
  const { error } = await supabase
    .from("entries")
    .update(localEntry)
    .eq("id", localEntry.id)
  if (error) console.error(error)
  return { error }
}
