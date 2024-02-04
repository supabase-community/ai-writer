import { type ChangeEvent } from "react"
import { useCompletion } from "ai/react"
import { Bot } from "lucide-react"
import { useDebounce, useUpdateEffect } from "usehooks-ts"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface EditorTitleAreaProps {
  title: string
  setTitle: (title: string) => void
  body: string
}
export default function EditorTitleArea({
  title,
  setTitle,
  body,
}: EditorTitleAreaProps) {
  /* useEffect(() => {
    console.log("title:", title)
  }, [title])
  useEffect(() => {
    console.log("body:", body)
  }, [body]) */

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/title-generation",
  })
  // Debounce the body value by 10 seconds
  const debouncedBody = useDebounce(body, 10000)

  // Function to handle input change and update the title value
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  // Async function to fetch a title suggestion only called when the debounced body value changes
  const generateTitle = async () => {
    complete(debouncedBody)
  }

  // When the body value changes call generateTitle with 10 second debounce
  useUpdateEffect(() => {
    if (debouncedBody.length > 20 && title.trim() === "") {
      // Only generate a title if the body is longer than 20 characters and the title is empty
      generateTitle()
    }
  }, [debouncedBody, title])

  // When the completion updates, update the value
  useUpdateEffect(() => {
    let newValue = completion.trim()
    if (newValue === "") return
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
        className="group/button absolute right-0 size-9 group-focus-within/input:bg-background"
        onClick={() => generateTitle()}
      >
        <Bot className="size-5 opacity-0 transition-opacity group-hover/input:opacity-100 group-focus/button:opacity-100" />
        <span className="sr-only">Generate title</span>
      </Button>
    </div>
  )
}
