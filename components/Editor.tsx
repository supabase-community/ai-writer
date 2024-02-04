"use client"

import { Loader2 } from "lucide-react"

import EditorTextArea from "./EditorTextArea"
import EditorTitleArea from "./EditorTitleArea"
import { useEntries } from "./EntryProvider"

export default function Editor() {
  const {
    currentEntry,
    setCurrentEntryTitle,
    setCurrentEntryBody,
    synchronizing,
    error,
    session,
  } = useEntries()

  return (
    <div className="flex size-full max-w-4xl flex-col gap-y-4 animate-in">
      <EditorTitleArea
        title={currentEntry.title}
        setTitle={setCurrentEntryTitle}
        body={currentEntry.body}
      />
      <EditorTextArea
        body={currentEntry.body}
        setCurrentEntryBody={setCurrentEntryBody}
      />
      <div className="mt-2 text-right text-xs">
        {session ? (
          error ? (
            <span className="text-red-500">
              {error.message ? error.message : error.toString()}
            </span>
          ) : synchronizing ? (
            <span>
              Backing up entries{" "}
              <Loader2 className="my-auto inline-block size-4 animate-spin" />
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
