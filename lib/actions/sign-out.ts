import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

export const signOut = async () => {
  "use server"
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  redirect("/signin")
}
