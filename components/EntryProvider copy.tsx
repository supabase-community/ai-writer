"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { PostgrestError, Session } from "@supabase/supabase-js"
import { useLocalStorage } from "usehooks-ts"

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
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [reconciled, setReconciled] = useState(false)
  const searchParams = useSearchParams()
  const paramEntryId = searchParams.get("entry")
  const [entries, setEntries] = useLocalStorage<Entry[]>("localEntries", [
    {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: firstTitle,
      body: firstEntry,
    },
  ])
  const [synchronizing, setSynchronizing] = useState(false)
  const [error, setError] = useState<PostgrestError>()

  // subscribe to user session changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // get current entry from query params
  const currentEntry =
    entries.find((entry) => entry.created_at === paramEntryId) || entries[0]

  // update the current entry title
  const setCurrentEntryTitle = (title: string) => {
    const updatedEntries = entries.map((entry) => {
      if (entry.created_at === currentEntry.created_at) {
        return { ...entry, title }
      }
      return entry
    })
    setEntries(updatedEntries)
  }

  const setCurrentEntryBody = (body: string) => {
    const updatedEntries = entries.map((entry) => {
      if (entry.created_at === currentEntry.created_at) {
        return { ...entry, body }
      }
      return entry
    })
    setEntries(updatedEntries)
  }

  const createEntry = () => {
    const newEntry: Entry = {
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: firstTitle,
      body: "",
    }

    setEntries((prevEntries) => [...prevEntries, newEntry])

    // Push the new entry URL to the browser history
    const newParams = new URLSearchParams()
    newParams.set("entry", newEntry.created_at)
    const newUrl = createUrlWithParams("/journal", newParams)
    window.history.pushState(null, "", newUrl)
  }

  const deleteEntry = (created_at: string) => {
    const updatedEntries = entries.filter(
      (entry) => entry.created_at !== created_at
    )
    setEntries(updatedEntries)

    // If all entries are deleted, create a new entry
    if (updatedEntries.length === 0) {
      createEntry()
      return
    }

    // Find the last edited entry
    const lastEditedEntry = updatedEntries.reduce(
      (prev, curr) => (prev.updated_at > curr.updated_at ? prev : curr),
      updatedEntries[0]
    )

    // Push the last edited entry URL to the browser history
    const newParams = new URLSearchParams()
    newParams.set("entry", lastEditedEntry.created_at)
    const newUrl = createUrlWithParams("/journal", newParams)
    window.history.pushState(null, "", newUrl)
  }

  // backup to server should run every 5 seconds when there are changes and there is a session
  const backupToServer = useCallback(async () => {
    const { error } = await supabase
      .from("entries")
      .upsert(entries, { onConflict: "created_at" })
    if (error) {
      setError(error)
    }
    setSynchronizing(false)
  }, [entries, supabase])

  const debouncedBackup = useCallback(() => {
    if (session) {
      backupToServer()
    }
  }, [session, backupToServer])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    debouncedBackup() // Initial call

    return () => clearTimeout(timeout)
  }, [debouncedBackup])

  // reconcile local entries with server entries should run when the session is established. It should combine the local entries with the server entries, with the more recently updated entry taking precedence. If the updatedAt and createdAt are the same prefer the local entry.
  useEffect(() => {
    if (reconciled) return
    console.log("reconciling entries")
    let cleanupFunction = false
    const reconcile = async () => {
      setSynchronizing(true)
      const { data: serverEntries, error } = await supabase
        .from("entries")
        .select("*")
        .order("updated_at", { ascending: false })
      if (error) {
        setError(error)
        setSynchronizing(false)
        return
      }
      if (cleanupFunction) return
      const updatedEntries = serverEntries
      const localEntries = entries

      const mergedEntries = updatedEntries.reduce((acc, entry) => {
        const localEntry = localEntries.find(
          (localEntry) => localEntry.created_at === entry.created_at
        )
        if (localEntry) {
          if (new Date(localEntry.updated_at) > new Date(entry.updated_at)) {
            return [...acc, localEntry]
          }
        }
        return [...acc, entry]
      }, [] as Entry[])

      setEntries(mergedEntries)
      setSynchronizing(false)
      setReconciled(true)
    }

    if (session) {
      reconcile()
    }

    return () => {
      cleanupFunction = true
    }
  }, [session, supabase, entries, setEntries, reconciled])

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
