import dynamic from "next/dynamic"

import { EditorSkeleton } from "@/components/EditorSkeleton"

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
