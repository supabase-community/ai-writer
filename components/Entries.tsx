"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type Session } from "@supabase/supabase-js"
import { useLocalStorage } from "@uidotdev/usehooks"
import { Plus, Trash } from "lucide-react"

import { addQueryParam, cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

// Define the structure of an entry
export interface Entry {
  created_at: string
  updated_at: string
  title: string
  body: string
}

export default function Entries() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const paramEntryId = searchParams.get("entry")
  const [entries, setEntries] = useLocalStorage<Entry[]>("entries", [])
  const sortedEntries = entries.sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
  )
  const deleteEntry = (entryId: string) => {
    const updatedEntryList = entries.filter(
      (entry) => entry.created_at !== entryId
    )
    setEntries(updatedEntryList)
    //push router to most recent entry
    const mostRecentEntry = updatedEntryList[0]
    if (mostRecentEntry?.created_at) {
      router.push(
        addQueryParam(
          "entry",
          mostRecentEntry.created_at,
          pathname,
          searchParams
        )
      )
    } else {
      router.push(pathname)
    }
  }
  return (
    <div className="my-4 flex h-full w-full flex-1 flex-col gap-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          const timestamp = new Date().toISOString()
          const newEntry: Entry = {
            created_at: timestamp,
            updated_at: timestamp,
            title: "",
            body: "",
          }
          const updatedEntryList = [...entries, newEntry]
          localStorage.setItem("entries", JSON.stringify(updatedEntryList))
          setEntries(updatedEntryList)
        }}
      >
        <Plus className="h-5 w-5" />
      </Button>
      {sortedEntries.map((entry) => (
        <div
          key={entry.created_at}
          className="group relative items-center justify-between"
        >
          <Link
            href={addQueryParam(
              "entry",
              entry.created_at,
              pathname,
              searchParams
            )}
            className={cn(
              buttonVariants({ variant: "link" }),
              paramEntryId === entry.created_at && "bg-foreground/10",
              "inline-block w-full truncate"
            )}
          >
            {entry.title.trim() !== "" ? (
              entry.title
            ) : (
              <span className="italic">New Entry</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 h-9 w-9"
            onClick={() => deleteEntry(entry.created_at)}
          >
            <Trash className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="sr-only">Delete entry</span>
          </Button>
        </div>
      ))}
    </div>
  )
}
