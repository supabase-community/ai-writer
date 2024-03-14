"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/supabase/client"
import type { PostgrestError, Session } from "@supabase/supabase-js"
import { useLocalStorage } from "usehooks-ts"

import { backupEntries } from "@/lib/actions/backup-entries"
import { generateEntry } from "@/lib/actions/create-entry"
import { createUrlWithParams } from "@/lib/utils"

import { firstBody, firstTitle } from "./FirstEntry"

// Define the structure of an entry
export interface Entry {
  id: string
  created_at: string
  updated_at: string
  title: string
  body: string
}

// Define the type for the entries context object
interface EntryContextType {
  entries: Entry[]
  setEntries: (entries: Entry[]) => void
  currentEntry: Entry | undefined
  currentEntryId: string | undefined
  currentEntryTitle: string
  currentEntryBody: string
  setCurrentEntryId: (id: string) => void
  setCurrentEntryTitle: (title: string) => void
  setCurrentEntryBody: (body: string) => void
  createEntry: ({ firstEntry }: { firstEntry?: boolean | undefined }) => void
  deleteEntry: (created_at: string) => void
  synchronizing: boolean
  error: PostgrestError | { message: string } | undefined
  setError: (error: PostgrestError | { message: string } | undefined) => void
  session: Session | null
  setSession: (session: Session | null) => void
}

// Create context
const EntryContext = createContext<EntryContextType | undefined>(undefined)

// Create a Provider component
const EntryProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [entries, setEntries] = useLocalStorage<Entry[]>("localEntries", [])
  const [synchronizing, setSynchronizing] = useState(false)
  const [error, setError] = useState<
    PostgrestError | { message: string } | undefined
  >()
  const [previousBackup, setPreviousBackup] = useState<Entry>()

  // Create a new entry if there are no entries
  useEffect(() => {
    if (!entries.length) {
      createEntry({ firstEntry: true })
    }
  }, [])

  //listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth event:", _event, session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Get entries from the server
  useEffect(() => {
    if (session) {
      const fetchEntries = async () => {
        const { data: entries, error } = await supabase
          .from("entries")
          .select("id, created_at, updated_at, title, body")
        if (error) {
          setError(error)
          return
        }
        setEntries(entries as Entry[])
      }
      fetchEntries()
    }
  }, [])
  const [currentEntryId, setCurrentEntryId] = useState<string | undefined>(
    entries[0]?.id
  )
  const currentEntry = entries.find((entry) => entry.id === currentEntryId)
  const currentEntryTitle = currentEntry?.title ?? ""
  const currentEntryBody = currentEntry?.body ?? ""

  const setCurrentEntryTitle = (title: string) => {
    //if (!currentEntry) return
    const updatedEntries = entries.map((entry) =>
      entry.id === currentEntry?.id
        ? { ...entry, title, updated_at: new Date().toISOString() }
        : entry
    )
    setEntries(updatedEntries)
  }

  const setCurrentEntryBody = (body: string) => {
    //if (!currentEntry) return
    const updatedEntries = entries.map((entry) =>
      entry.id === currentEntry?.id
        ? { ...entry, body, updated_at: new Date().toISOString() }
        : entry
    )
    setEntries(updatedEntries)
  }

  const createEntry = async ({ firstEntry = false }) => {
    const timestamp = new Date().toISOString()
    const { data, error } = await generateEntry({
      id: "",
      created_at: timestamp,
      updated_at: timestamp,
      title: firstEntry ? firstTitle : "",
      body: firstEntry ? firstBody : "",
    })
    if (error) {
      console.error(error)
      setError(error)
      return
    }
    setEntries((prevEntries) => [data, ...prevEntries])

    // Push the new entry URL to the browser history
    const newParams = new URLSearchParams()
    newParams.set("entry", data.id)
    const newUrl = createUrlWithParams("/", newParams)
    return router.push(newUrl)
  }

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.rpc("delete_entry", { entry_id: id })
    if (error) {
      console.error(error)
      setError(error)
      return
    }
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
    // If last entry was deleted, create a new generic one
    if (!updatedEntries.length) {
      await createEntry({ firstEntry: true })
      return
    }
    const newParams = new URLSearchParams()
    newParams.set("entry", updatedEntries[0]?.id ?? "")
    const newUrl = createUrlWithParams("/", newParams)
    window.history.pushState(null, "", newUrl)
  }

  // Backup entries every 5 seconds when there are changes
  useEffect(() => {
    const interval = setInterval(async () => {
      if (session && previousBackup !== currentEntry) {
        console.log("Backing up entries")
        console.log("updated_entries: ", entries)
        setSynchronizing(true)
        const { data, error } = await backupEntries(entries)
        if (error) {
          if (error.message === "User ID is NULL") {
            setSession(null)
          } else setError(error)
        }
        console.log("data", data)
        setPreviousBackup(currentEntry)
        setSynchronizing(false)
      }
    }, 5000)

    // Clean up the interval on component unmount
    return () => clearInterval(interval)
  }, [entries])

  return (
    <EntryContext.Provider
      value={{
        entries,
        setEntries,
        currentEntry,
        currentEntryId,
        currentEntryTitle,
        currentEntryBody,
        setCurrentEntryId,
        setCurrentEntryTitle,
        setCurrentEntryBody,
        createEntry,
        deleteEntry,
        synchronizing,
        error,
        setError,
        session,
        setSession,
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
