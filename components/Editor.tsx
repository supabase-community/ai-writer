"use client"

import { LoaderCircle } from "lucide-react"

import EditorBodyArea from "./EditorBodyArea"
import { EditorSkeleton } from "./EditorSkeleton"
import EditorTitleArea from "./EditorTitleArea"
import { useEntries } from "./EntryProvider"

export default function Editor() {
  const {
    currentEntry,
    currentEntryTitle,
    currentEntryBody,
    setCurrentEntryTitle,
    setCurrentEntryBody,
    synchronizing,
    error,
    session = null,
  } = useEntries()

  if (!currentEntry) return <EditorSkeleton />

  return (
    <div className="flex size-full max-w-4xl flex-col gap-y-4 animate-in">
      <EditorTitleArea
        title={currentEntryTitle}
        setTitle={setCurrentEntryTitle}
        body={currentEntryBody}
      />
      <EditorBodyArea
        body={currentEntryBody}
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
              <LoaderCircle className="my-auto inline-block size-4 animate-spin" />
            </span>
          ) : (
            "Backup complete"
          )
        ) : (
          "Sign in to save entries to Supabase"
        )}
      </div>
    </div>
  )
}
