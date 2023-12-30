import dynamic from "next/dynamic"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

import { Skeleton } from "@/components/ui/skeleton"

const EditorSkeleton = () => (
  <div className="flex h-full w-full flex-1 items-center justify-center p-8">
    <div className="grid h-full max-w-4xl flex-1 grid-rows-[50px_1fr] gap-4 animate-in">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-full w-full" />
    </div>
  </div>
)



export default async function Index() {
  const Editor = dynamic(() => import("@/components/Editor"), {
    loading: () => <EditorSkeleton />,
    ssr: false,
  })
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center overflow-y-auto p-8">
      <Editor session={session} />
    </div>
  )
}
