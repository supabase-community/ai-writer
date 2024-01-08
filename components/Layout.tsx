import dynamic from "next/dynamic"
import { Menu } from "lucide-react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import AuthButton from "./AuthButton"
import DeployButton from "./DeployButton"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

const supabasePath =
  "M 9.7113571,0.39877949 C 10.324476,-0.37341465 11.567653,0.04969199 11.582428,1.0355858 l 0.09466,14.4196652 H 2.1026547 c -1.75621979,0 -2.73569549,-2.028386 -1.64362618,-3.403771 z M 13.654582,23.601263 c -0.613123,0.772108 -1.856281,0.349071 -1.871052,-0.636811 L 11.567501,8.5447627 h 9.695787 c 1.756165,0 2.735615,2.0283873 1.643599,3.4037733 z m 0,0 c -0.613123,0.772108 -1.856281,0.349071 -1.871052,-0.636811 L 11.567501,8.5447627 h 9.695787 c 1.756165,0 2.735615,2.0283873 1.643599,3.4037733 z"

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

const Footer = () => (
  <footer className="flex w-full flex-col justify-center gap-y-4 border-t border-t-foreground/10 py-4 text-center text-xs">
    <p>
      Powered by{" "}
      <a
        href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
        target="_blank"
        className="inline-flex items-center font-bold hover:underline"
        rel="noreferrer"
      >
        Supabase
        <svg
          viewBox="0 0 24 24"
          className="ml-1 inline-block h-3 w-3 fill-current"
        >
          <path d={supabasePath} />
        </svg>
      </a>
    </p>
    <DeployButton />
  </footer>
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
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden h-full w-full md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={25} maxSize={40}>
            <div className="flex h-full max-h-dvh items-center justify-center p-6">
              <nav className="flex h-full max-h-full w-full flex-col justify-between">
                <Logo />
                <Entries />
                <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                  <AuthButton />
                  <ThemeToggle />
                </div>
                <Footer />
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
      {/* Mobile layout */}
      <Sheet>
        <div className="flex h-full w-full md:hidden">
          <div className="flex h-full w-full flex-col items-center justify-center p-6">
            <nav className="flex w-full flex-row justify-between">
              <SheetTrigger>
                <Button variant="ghost" className="px-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <Logo />
              <SheetContent side="left">
                <div className="flex h-full max-h-full w-full flex-col justify-between mt-2">
                  <Entries />
                  <div className="flex w-full items-center justify-between p-3 text-sm">
                    <AuthButton />
                    <ThemeToggle />
                  </div>
                  <Footer />
                </div>
              </SheetContent>
            </nav>
            <div className="relative mt-2 h-full w-full items-center justify-center">
              {children}
            </div>
          </div>
        </div>
      </Sheet>
    </>
  )
}
