import dynamic from "next/dynamic"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import AuthButton from "./AuthButton"
import DeployButton from "./DeployButton"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import { Skeleton } from "./ui/skeleton"

const EntriesSkeleton = () => (
  <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-2 p-2">
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-full" />
  </div>
)

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const Entries = dynamic(() => import("@/components/Entries"), {
    loading: () => <EntriesSkeleton />,
    ssr: false,
  })
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return (
    <div className="hidden h-full w-full md:block">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={25} maxSize={40}>
          <div className="flex h-full items-center justify-center p-6">
            <nav className="flex h-full w-full flex-col justify-between">
              <div className="flex h-full w-full flex-col justify-between space-y-4">
                <Logo />
                <Entries />
                <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                  {!session && <AuthButton />}
                  <ThemeToggle />
                </div>
              </div>
              <footer className="flex w-full flex-col justify-center gap-y-4 border-t border-t-foreground/10 py-4 text-center text-xs">
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Supabase
                  </a>
                </p>
                <DeployButton />
              </footer>
            </nav>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} maxSize={80}>
          <div className="relative h-full w-full items-center justify-center">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
