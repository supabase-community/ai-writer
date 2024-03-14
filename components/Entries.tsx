"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Trash } from "lucide-react"

import { cn, createUrlWithParams } from "@/lib/utils"
import { useEntries } from "@/components/EntryProvider"

import EntriesSkeleton from "./EntriesSkeleton"
import { Button, buttonVariants } from "./ui/button"

export default function Entries() {
  const pathname = usePathname()
  const { entries, currentEntryId, createEntry, deleteEntry } = useEntries()

  if (pathname === "/reconcile") return <EntriesSkeleton />

  return (
    <>
      <Button
        variant="outline"
        className="my-3 w-full"
        onClick={() => createEntry({})}
      >
        <Plus className="size-5" />
      </Button>
      <div className="size-full overflow-y-auto">
        {entries.map((entry, index) => {
          const newParams = new URLSearchParams()
          newParams.set("entry", entry.id)
          return (
            <div
              key={index}
              className="group/link relative items-center justify-between"
            >
              <Link
                href={createUrlWithParams("/", newParams)}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "inline-block w-full truncate",
                  currentEntryId === entry.id && "bg-secondary"
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
                  currentEntryId === entry.id
                    ? "focus-visible:bg-secondary group-hover/link:bg-secondary"
                    : "focus-visible:bg-background group-hover/link:bg-background"
                )}
                onClick={() => deleteEntry(entry.id)}
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
