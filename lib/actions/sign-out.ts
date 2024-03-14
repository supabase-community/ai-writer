"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/signin")
}
