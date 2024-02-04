"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { PostgrestError, Session } from "@supabase/supabase-js"
import {
  useDebounce,
  useEffectOnce,
  useSessionStorage,
  useUpdateEffect,
} from "usehooks-ts"

import { createUrlWithParams } from "@/lib/utils"

import { firstEntry, firstTitle } from "./FirstEntry"

// Define the structure of an entry
export interface Entry {
  created_at: string
  updated_at: string
  title: string
  body: string
}

// Define the type for the context state
interface EntryContextType {
  entries: Entry[]
  currentEntry: Entry
  setCurrentEntryTitle: (title: string) => void
  setCurrentEntryBody: (body: string) => void
  createEntry: () => void
  deleteEntry: (created_at: string) => void
  synchronizing: boolean
  error: PostgrestError | undefined
  session: Session | null
}

// Create a context
const EntryContext = createContext<EntryContextType | undefined>(undefined)

// Create a Provider component
const EntryProvider = ({ children }: { children: React.ReactNode }) => {
  noStore() // opt out of Next.js built-in caching
  const router = useRouter()
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)

  // Listen for changes to the auth state and update the session context
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
      if (event === "SIGNED_OUT") {
        setSession(null)
      }  else if (session) {
        setSession(session)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const searchParams = useSearchParams()
  const paramEntryId = searchParams.get("entry")
  const [localEntries, setLocalEntries] = useSessionStorage<Entry[]>(
    "localEntries",
    []
  )
  const [entries, setEntries] = useState<Entry[]>(localEntries)
  const currentEntry = entries.find(
    (entry) => entry.created_at === paramEntryId
  ) || {
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    title: firstTitle,
    body: firstEntry,
  }

  const setCurrentEntryTitle = (title: string) => {
    const updatedEntry = {
      ...currentEntry,
      title,
      updated_at: new Date().toISOString(),
      created_at: currentEntry.created_at || new Date().toISOString(),
    }
    setEntries(
      entries.map((entry) =>
        entry.created_at === updatedEntry.created_at ? updatedEntry : entry
      )
    )
  }
  const setCurrentEntryBody = (body: string) => {
    const updatedEntry = {
      ...currentEntry,
      body,
      updated_at: new Date().toISOString(),
      created_at: currentEntry.created_at || new Date().toISOString(),
    }
    setEntries(
      entries.map((entry) =>
        entry.created_at === updatedEntry.created_at ? updatedEntry : entry
      )
    )
  }

  const sortEntries = (entries: Entry[]) =>
    entries.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

  const createEntry = () => {
    const timestamp = new Date().toISOString()
    const newParams = new URLSearchParams()
    newParams.set("entry", timestamp)
    // check that there is not already an entry with this timestamp
    if (entries.some((entry) => entry.created_at === timestamp)) {
      router.push(createUrlWithParams("/", newParams))
      return
    }
    const newEntry: Entry = {
      created_at: timestamp,
      updated_at: timestamp,
      title: "",
      body: "",
    }
    const updatedEntryList = [...entries, newEntry]
    setEntries(sortEntries(updatedEntryList))
    router.push(createUrlWithParams("/", newParams))
  }

  const deleteEntry = async (created_at: string) => {
    const { error } = await supabase
      .from("entries")
      .delete()
      .eq("created_at", created_at)
    if (error) {
      setError(error)
      return
    }
    const updatedEntries = entries.filter(
      (entry) => entry.created_at !== created_at
    )
    if (!updatedEntries.length) {
      const timestamp = new Date().toISOString()
      const newParams = new URLSearchParams()
      newParams.set("entry", timestamp)
      setEntries([
        {
          created_at: timestamp,
          updated_at: timestamp,
          title: firstTitle,
          body: firstEntry,
        },
      ])
      router.push(createUrlWithParams("/", newParams))
      return
    }
    const newParams = new URLSearchParams()
    newParams.set("entry", updatedEntries[0].created_at)
    router.push(createUrlWithParams("/", newParams))
    setEntries(updatedEntries)
  }
  const debouncedEntries = useDebounce(entries, 1000)
  const [synchronizing, setSynchronizing] = useState(false)
  const [error, setError] = useState<PostgrestError>()

  // Fetch entries from Supabase and reconcile with local entries
  useEffectOnce(() => {
    async function reconcileEntries() {
      //const { data: supabaseEntries, error: entryFetchError  } = useQuery(getEntries(supabase))
      const { data: supabaseEntries, error: entryFetchError } = await supabase
        .from("entries")
        .select("title, body, created_at, updated_at")
      if (entryFetchError) {
        setError(entryFetchError)
      }
      // Fix supabaseEntries dates
      supabaseEntries &&
        supabaseEntries.forEach((entry) => {
          entry.created_at = new Date(entry.created_at).toISOString()
          entry.updated_at = new Date(entry.updated_at).toISOString()
        })
      // If neither local or Supabase entries exist create a starter entry
      if (!localEntries.length && !supabaseEntries?.length) {
        const timestamp = new Date().toISOString()
        const newParams = new URLSearchParams()
        newParams.set("entry", timestamp)
        setEntries([
          {
            created_at: timestamp,
            updated_at: timestamp,
            title: firstTitle,
            body: firstEntry,
          },
        ])
        router.push(createUrlWithParams("/", newParams))
        return
      }
      // If no local entries exist but Supabase entries do use the Supabase entries
      if (!localEntries.length && supabaseEntries?.length)
        setEntries(supabaseEntries)
      // If local entries exist but Supabase entries do not use the local entries
      else if (localEntries.length && !supabaseEntries?.length)
        setEntries(localEntries)
      // If both local and Supabase entries exist reconcile them
      else if (localEntries.length && supabaseEntries?.length) {
        const combinedEntries = localEntries.map((localEntry) => {
          const supabaseEquivalent = supabaseEntries.find(
            (supabaseEntry) =>
              supabaseEntry.created_at === localEntry.created_at &&
              supabaseEntry.updated_at > localEntry.updated_at
          )
          return supabaseEquivalent || localEntry
        })
        const supabaseUniqueEntries = supabaseEntries.filter(
          (supabaseEntry) =>
            !localEntries.some(
              (localEntry) => localEntry.created_at === supabaseEntry.created_at
            )
        )
        const reconciledEntries = sortEntries([
          ...combinedEntries,
          ...supabaseUniqueEntries,
        ])
        setEntries(reconciledEntries)
      }

      // If paramEntryId is not in the entries list redirect to the first entry
      if (
        paramEntryId &&
        !entries.some((entry) => entry.created_at === paramEntryId)
      ) {
        const newParams = new URLSearchParams()
        newParams.set("entry", entries[0]?.created_at)
        router.push(createUrlWithParams("/", newParams))
      }

      // If there is no paramEntryId redirect to the first entry
      if (!paramEntryId) {
        const newParams = new URLSearchParams()
        newParams.set("entry", entries[0]?.created_at)
        router.push(createUrlWithParams("/", newParams))
      }
    }
    reconcileEntries()
  })

  // Update session storage and Supabase when local entries change
  useEffect(() => {
    setSynchronizing(true)
    setLocalEntries(debouncedEntries)
    const upsertEntries = async () => {
      const { error } = await supabase
        .from("entries")
        .upsert(debouncedEntries, { onConflict: "created_at" })
      if (error) {
        setError(error)
      }
    }
    upsertEntries()
    setSynchronizing(false)
  }, [debouncedEntries, setLocalEntries, supabase, setError, setSynchronizing])

  // If the paramEntryId changes check that it is in the entries list, if not redirect to the first entry
  useUpdateEffect(() => {
    if (
      paramEntryId &&
      !entries.some((entry) => entry.created_at === paramEntryId)
    ) {
      const newParams = new URLSearchParams()
      newParams.set("entry", entries[0]?.created_at)
      router.push(createUrlWithParams("/", newParams))
    }
  }, [paramEntryId])

  return (
    <EntryContext.Provider
      value={{
        entries,
        currentEntry,
        setCurrentEntryTitle,
        setCurrentEntryBody,
        createEntry,
        deleteEntry,
        synchronizing,
        error,
        session,
      }}
    >
      {children}
    </EntryContext.Provider>
  )
}

export default EntryProvider

// Hook for using entries context
export const useEntries = () => {
  const context = useContext(EntryContext)
  if (!context) {
    throw new Error("useEntries must be used inside of EntryProvider")
  }
  return context
}
