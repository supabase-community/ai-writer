"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname, useSearchParams } from "next/navigation"
import { Menu } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import AuthButton from "./AuthButton"
import EntriesSkeleton from "./EntriesSkeleton"
import Footer from "./Footer"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import { Button } from "./ui/button"

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const Entries = dynamic(() => import("@/components/Entries"), {
    loading: () => <EntriesSkeleton />,
    ssr: false,
  })
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    // Close the sheet when the pathname or search params change
    setOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex size-full flex-col items-center justify-center p-5 md:hidden">
        <nav className="flex w-full flex-row justify-between p-1">
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="group">
              <Menu className="size-5 -translate-x-3 transition-transform duration-300 group-hover:translate-x-0 group-focus:translate-x-0" />
            </Button>
          </SheetTrigger>
          <Logo />
          <SheetContent side="left">
            <div className="mt-3 flex h-full max-h-full flex-col justify-between">
              <Entries />
              <div className="flex w-full items-center justify-between p-3 text-sm">
                <AuthButton />
                <ThemeToggle />
              </div>
              <Footer />
            </div>
          </SheetContent>
        </nav>
        <div className="relative mt-2 size-full items-center justify-center">
          {children}
        </div>
      </div>
    </Sheet>
  )
}
