import dynamic from "next/dynamic"

import AuthButton from "./AuthButton"
import EntriesSkeleton from "./EntriesSkeleton"
import Footer from "./Footer"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"

export default function DesktopLayout({
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
      <nav className="flex max-h-full w-1/3 min-w-40 max-w-sm flex-col items-center justify-center border-r border-border p-6">
        <Logo />
        <Entries />
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
          <AuthButton />
          <ThemeToggle />
        </div>
        <Footer />
      </nav>
      <div className="relative size-full max-h-dvh items-center justify-center">
        {children}
      </div>
    </div>
  )
}
  