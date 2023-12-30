"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type Session } from "@supabase/supabase-js"
import { useLocalStorage } from "@uidotdev/usehooks"

import { addQueryParam } from "@/lib/utils"

import { Entry } from "./Entries"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

// Define the props for the Editor component
interface EditorProps {
  session: Session | null
}

export default function Editor({ session }: EditorProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const paramsEntryId = searchParams.get("entry")
  const router = useRouter()
  // Initialize the entry list from local storage
  const [entries, setEntries] = useLocalStorage<Entry[]>("entries", [])
  useEffect(() => {
    console.log(entries)
  }, [entries])
  const createFirstEntry = () => {
    const timestamp = new Date().toISOString()
    const newEntry: Entry = {
      created_at: timestamp,
      updated_at: timestamp,
      title: "",
      body: "",
    }
    const updatedEntryList = [...entries, newEntry]
    setEntries(updatedEntryList)
    router.push(addQueryParam("entry", timestamp, pathname, searchParams))
  }

  // if there is not a paramsEntryId but there are entries push the most recent entry
  useEffect(() => {
    if (!paramsEntryId && entries.length > 0) {
      const mostRecentEntry = entries[0]
      router.push(
        addQueryParam(
          "entry",
          mostRecentEntry.created_at,
          pathname,
          searchParams
        )
      )
    } else if (!paramsEntryId && entries.length === 0) {
      createFirstEntry()
    }
  }, [paramsEntryId, entries])

  // Find the current entry
  const currentEntry: Entry =
    entries.find((entry) => entry.created_at === paramsEntryId) ||
    ({} as Entry)

  // Handle changes in title and body
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedEntry = {
      ...currentEntry,
      title: e.target.value,
      updated_at: new Date().toISOString(),
    }
    const updatedEntryList = entries.map((entry) =>
      entry.created_at === paramsEntryId ? updatedEntry : entry
    )
    setEntries(updatedEntryList)
  }

  const handleBodyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const updatedEntry = {
      ...currentEntry,
      body: e.target.value,
      updated_at: new Date().toISOString(),
    }
    const updatedEntryList = entries.map((entry) =>
      entry.created_at === paramsEntryId ? updatedEntry : entry
    )
    setEntries(updatedEntryList)
  }

  // Render the editor
  return (
    <div className="grid h-full max-w-4xl flex-1 grid-rows-[50px_1fr] gap-4 animate-in">
      <Input
        placeholder="Title (start typing to autogenerate)"
        type="text"
        value={currentEntry.title || ""}
        onChange={handleTitleChange}
      />
      <Textarea
        placeholder="Let your thoughts flow freely..."
        className="h-full resize-none"
        value={currentEntry.body || ""}
        onChange={handleBodyChange}
      />
    </div>
  )
}
