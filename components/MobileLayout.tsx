import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MobileNavigation({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <div className="flex h-full items-center justify-center p-6">
            this is content
          </div>
        </SheetContent>
      </Sheet>
      <div className="relative h-full w-full items-center justify-center md:hidden">
        {children}
      </div>
    </>
  )
}
