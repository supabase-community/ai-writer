"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

import { useEntries } from "./EntryProvider"

export function EntrySetter() {
  const searchParams = useSearchParams()
  const paramEntryId = searchParams.get("entry")
  const { setCurrentEntryId } = useEntries()
  
  useEffect(() => {
    if (paramEntryId) {
      setCurrentEntryId(paramEntryId)
    }
  }, [paramEntryId])

  return null
}
