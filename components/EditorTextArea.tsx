import React, { useEffect, useRef } from "react"
import { useCompletion } from "ai/react"
import { useDebounce } from "usehooks-ts"

import { Textarea } from "./ui/textarea"

interface EditorTextAreaProps {
  body: string
  setBody: (body: string) => void
}

export default function EditorTextArea({
  body,
  setBody,
}: EditorTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const completionRef = useRef<HTMLDivElement>(null)
  const debouncedBody = useDebounce(body, 1000)
  const { complete, error, setCompletion, completion, stop, isLoading } =
    useCompletion({
      api: "/api/completion",
    })

  // When the body changes, fetch a completion with 1 second debounce
  useEffect(() => {
    if (debouncedBody?.length > 5) {
      complete(debouncedBody)
    }
  }, [debouncedBody])

  // When the body changes instantly clear the completion and stop fetching
  useEffect(() => {
    stop()
    setCompletion("")
  }, [body])

  // Function to replace the current word with the completion
  const appendSuggestion = () => {
    // If there is no space at the end of the body or the beginning of the completion, add one. Otherwise if the completion begins with punctuation don't add a space
    const newValue =
      body +
      (body.endsWith(" ") ||
      completion.startsWith(" ") ||
      completion.startsWith(".") ||
      completion.startsWith("?") ||
      completion.startsWith("!")
        ? ""
        : " ") +
      completion
    setBody(newValue)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        // Handle tab key
        e.preventDefault()
        appendSuggestion()
      }
    }

    const textarea = textareaRef.current
    textarea?.addEventListener("keydown", handleKeyDown)
    return () => textarea?.removeEventListener("keydown", handleKeyDown)
  }, [body, completion])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }

  // Sync scroll positions
  useEffect(() => {
    const syncScroll = () => {
      if (completionRef.current && textareaRef.current) {
        completionRef.current.scrollTop = textareaRef.current.scrollTop
        completionRef.current.scrollLeft = textareaRef.current.scrollLeft
      }
    }

    const textarea = textareaRef.current
    textarea?.addEventListener("scroll", syncScroll)

    return () => textarea?.removeEventListener("scroll", syncScroll)
  }, [])

  return (
    <div className="relative px-0">
      <Textarea
        ref={textareaRef}
        value={body}
        onChange={handleChange}
        placeholder="Body (start typing to activate generative autocomplete)"
        style={
          completion.length
            ? { paddingBottom: "4rem" }
            : { paddingBottom: "0.5rem" }
        }
        className="absolute left-0 top-0 z-10 h-full resize-none bg-transparent outline-none"
      />
      {/* Completion overlay */}
      <div
        ref={completionRef}
        style={
          completion.length
            ? { paddingBottom: "4rem" }
            : { paddingBottom: "0.5rem" }
        }
        className="absolute left-0 top-0 z-0 h-full min-h-[60px] w-full resize-none overflow-y-auto border border-transparent px-3 py-2 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="invisible whitespace-pre-wrap">{body}</span>
        <span className="whitespace-pre-wrap text-muted-foreground">
          {(body.endsWith(" ") ||
          completion.startsWith(" ") ||
          completion.startsWith(".") ||
          completion.startsWith("?") ||
          completion.startsWith("!")
            ? ""
            : " ") + completion}
        </span>
      </div>
    </div>
  )
}
