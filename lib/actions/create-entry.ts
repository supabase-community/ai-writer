"use server"

import crypto from "crypto"
import { createClient } from "@/supabase/server"

import type { Entry } from "@/components/EntryProvider"

export const generateEntry = async (entry: Entry) => {
  entry.id = crypto.randomUUID()
  console.log(entry)
  const supabase = createClient()
  const { error } = await supabase.rpc("create_entry", entry)
  if (error) console.error(error)
  const data = entry
  return { data, error }
}
