"use client"

import { type Session } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

import EditorTextArea from "./EditorTextArea"
import EditorTitleArea from "./EditorTitleArea"
import { useEntries } from "./EntryProvider"

// Define the props for the Editor component
interface EditorProps {
  session: Session | null
}

export default function Editor({ session }: EditorProps) {
  const { title, setTitle, body, setBody, synchronizing, error } = useEntries()

  return (
    <div className="grid h-full max-w-4xl flex-1 grid-rows-[50px_1fr] gap-4 animate-in">
      <EditorTitleArea title={title} setTitle={setTitle} textareaValue={body} />
      <EditorTextArea body={body} setBody={setBody} />
      <div className="text-right text-xs">
        {session ? (
          error ? (
            <span className="text-red-500">
              {error.message ? error.message : error.toString()}
            </span>
          ) : synchronizing ? (
            <span>
              Backing up entries{" "}
              <Loader2 className="my-auto inline-block h-4 w-4 animate-spin" />
            </span>
          ) : (
            "Backup complete"
          )
        ) : (
          "Login to save your entries to Supabase"
        )}
      </div>
    </div>
  )
}
