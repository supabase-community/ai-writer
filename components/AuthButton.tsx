import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const signOut = async () => {
    "use server"

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    return redirect("/login")
  }

  return session ? (
    <form action={signOut}>
      <Button size="sm">Logout</Button>
    </form>
  ) : (
    <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
      Login
    </Link>
  )
}
