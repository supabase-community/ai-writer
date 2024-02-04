import dynamic from "next/dynamic"

import AuthButton from "./AuthButton"
import EntriesSkeleton from "./EntriesSkeleton"
import Footer from "./Footer"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"

export default async function DesktopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const Entries = dynamic(() => import("@/components/Entries"), {
    loading: () => <EntriesSkeleton />,
    ssr: false,
  })
  return (
    <div className="hidden size-full md:flex">
      <div className="h-full max-w-sm border-r border-border">
        <div className="flex h-full max-h-dvh items-center justify-center p-6">
          <nav className="flex size-full max-h-full flex-col justify-between">
            <Logo />
            <Entries />
            <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
              <AuthButton />
              <ThemeToggle />
            </div>
            <Footer />
          </nav>
        </div>
      </div>
      <div className="relative col-span-3 size-full max-h-dvh items-center justify-center">
        {children}
      </div>
    </div>
  )
}
