"use server"

import crypto from "crypto"
import { createClient } from "@/supabase/server"

import type { Entry } from "@/components/EntryProvider"

export const generateEntry = async (entry: Entry) => {
  entry.id = crypto.randomUUID()
  const supabase = createClient()
  const { error } = await supabase.from("entries").upsert(entry)

  if (error) console.error(error)

  const data = entry
  return { data }
}
