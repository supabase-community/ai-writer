import { createClient } from "@/supabase/server"

import { Reconciler } from "./Reconciler"

export default async function ReconcilePage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return <Reconciler session={session} />
}
