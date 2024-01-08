"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Plus, Trash } from "lucide-react"

import { cn, createUrlWithParams } from "@/lib/utils"
import { useEntries } from "@/components/EntryProvider"

import { Button, buttonVariants } from "./ui/button"

// Define the structure of an entry
export interface Entry {
  created_at: string
  updated_at: string
  title: string
  body: string
}

export default function Entries() {
  const { entries, created_at, createEntry, deleteEntry } = useEntries()

  return (
    <>
      <Button variant="outline" className="my-3 w-full" onClick={createEntry}>
        <Plus className="h-5 w-5" />
      </Button>
      <div className="h-full w-full overflow-y-auto">
        {entries.map((entry) => {
          const newParams = new URLSearchParams()
          newParams.set("entry", entry.created_at)
          return (
            <div
              key={entry.created_at}
              className="group/link relative items-center justify-between"
            >
              <Link
                href={createUrlWithParams("/", newParams)}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "inline-block w-full truncate",
                  created_at === entry.created_at && "bg-foreground/10"
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
                className="group/button absolute right-0 h-9 w-9"
                onClick={() => deleteEntry(entry.created_at)}
              >
                <Trash className="h-5 w-5 opacity-0 transition-opacity group-hover/link:opacity-100 group-focus/button:opacity-100" />
                <span className="sr-only">Delete entry</span>
              </Button>
            </div>
          )
        })}
      </div>
    </>
  )
}
