import React, { useEffect, useRef } from "react"
import { useCompletion } from "ai/react"
import { Bot } from "lucide-react"
import { useDebounce } from "usehooks-ts"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface EditorTitleAreaProps {
  title: string
  setTitle: (title: string) => void
  textareaValue: string
}
export default function EditorTitleArea({
  title,
  setTitle,
  textareaValue,
}: EditorTitleAreaProps) {
  const { complete, error, setCompletion, completion, stop, isLoading } =
    useCompletion({
      api: "/api/title-generation",
    })
  // Debounce the title value by 10 seconds
  const debouncedTitle = useDebounce(textareaValue, 10000)

  // Function to handle input change and update the title value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  // Async function to fetch a title suggestion
  const generateTitle = async () => {
    complete(debouncedTitle)
  }

  // When the body value changes call generateTitle with 10 second debounce
  useEffect(() => {
    if (debouncedTitle?.length > 20 && title.trim() === "") {
      // Only generate a title if the body is longer than 20 characters and the title is empty
      generateTitle()
    }
  }, [debouncedTitle])

  // When the completion updates, update the value
  useEffect(() => {
    if (completion === "") return
    let newValue = completion.trim()
    // Remove surrounding quotes if present
    if (newValue.startsWith('"')) newValue = newValue.slice(1)
    if (newValue.endsWith('"')) newValue = newValue.slice(0, -1)
    setTitle(newValue)
  }, [completion])

  return (
    <div className="group/input relative items-center justify-between">
      <Input
        placeholder={
          isLoading
            ? "Loading..."
            : "Title (start typing below to auto-generate title)"
        }
        type="text"
        value={title}
        onChange={handleChange}
        className="inline-block"
      />
      <Button
        variant="ghost"
        size="icon"
        className="group/button absolute right-0 h-9 w-9 "
        onClick={() => generateTitle()}
      >
        <Bot className="h-5 w-5 opacity-0 transition-opacity group-hover/input:opacity-100 group-focus/button:opacity-100" />
        <span className="sr-only">Generate title</span>
      </Button>
    </div>
  )
}
