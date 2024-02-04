"use client"

import Link from "next/link"
import { Plus, Trash } from "lucide-react"

import { cn, createUrlWithParams } from "@/lib/utils"
import { useEntries } from "@/components/EntryProvider"

import { Button, buttonVariants } from "./ui/button"

export default function Entries() {
  const { entries, currentEntry, createEntry, deleteEntry } = useEntries()

  return (
    <>
      <Button variant="outline" className="my-3 w-full" onClick={createEntry}>
        <Plus className="size-5" />
      </Button>
      <div className="size-full overflow-y-auto">
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
                  currentEntry.created_at === entry.created_at && "bg-secondary"
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
                className={cn(
                  "group/button absolute right-0 h-9 w-9",
                  currentEntry.created_at === entry.created_at
                    ? "focus-visible:bg-secondary group-hover/link:bg-secondary"
                    : "focus-visible:bg-background group-hover/link:bg-background"
                )}
                onClick={() => deleteEntry(entry.created_at)}
              >
                <Trash className="size-5 opacity-0 transition-opacity group-hover/link:opacity-100 group-focus/button:opacity-100" />
                <span className="sr-only">Delete entry</span>
              </Button>
            </div>
          )
        })}
      </div>
    </>
  )
}
