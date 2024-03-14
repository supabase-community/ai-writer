import { useEffect, type ChangeEvent } from "react"
import { useCompletion } from "ai/react"
import { Bot } from "lucide-react"
import { useDebounceValue } from "usehooks-ts"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface EditorTitleAreaProps {
  title: string 
  setTitle: (title: string) => void
  body: string | undefined
}
export default function EditorTitleArea({
  title = "",
  setTitle,
  body,
}: EditorTitleAreaProps) {
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/title-generation",
  })
  const [debouncedBody, setDebouncedBody] = useDebounceValue("", 5000)

  useEffect(() => {
    body && setDebouncedBody(body)
  }, [body, setDebouncedBody])

  // Function to handle input change and update the title value
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (debouncedBody.length > 20 && title?.trim() === "") {
      complete(debouncedBody)
    }
  }

  // Function to generate a title suggestion
  const generateTitle = () => {
    complete(debouncedBody)
  }

  // Function to format the completion and update the title
  const updateTitle = (newValue: string) => {
    const formattedValue = newValue.trim()
    if (formattedValue !== "") {
      let updatedValue = formattedValue
      if (updatedValue.startsWith('"')) updatedValue = updatedValue.slice(1)
      if (updatedValue.endsWith('"')) updatedValue = updatedValue.slice(0, -1)
      setTitle(updatedValue)
    }
  }

  // Update the title when the completion changes
  if (completion && completion !== title) {
    updateTitle(completion)
  }

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
