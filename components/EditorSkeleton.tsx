import { Skeleton } from "./ui/skeleton";

export const EditorSkeleton = () => (
  <div className="flex size-full flex-1 items-center justify-center p-8">
    <div className="grid h-full max-w-4xl flex-1 grid-rows-[50px_1fr] gap-4 animate-in">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="size-full" />
    </div>
  </div>
)
