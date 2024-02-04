import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

const EditorSkeleton = () => (
  <div className="flex size-full flex-1 items-center justify-center p-8">
    <div className="grid h-full max-w-4xl flex-1 grid-rows-[50px_1fr] gap-4 animate-in">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="size-full" />
    </div>
  </div>
)

export default async function Index() {
  const Editor = dynamic(() => import("@/components/Editor"), {
    loading: () => <EditorSkeleton />,
    ssr: false,
  })

  return (
    <div className="flex size-full flex-1 items-center justify-center overflow-y-auto md:p-8">
      <Editor />
    </div>
  )
}
