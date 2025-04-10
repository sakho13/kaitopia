import { KaitopiaTitle } from "@/components/atoms/KaitopiaTitle"
import UserPopover from "@/components/molecules/UserPopover"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='bg-background text-text min-h-screen'>
      <header className='bg-primary text-text-on-color p-4 flex justify-between items-center shadow'>
        <KaitopiaTitle />

        <UserPopover />
      </header>

      <main className='p-6 max-w-6xl mx-auto'>{children}</main>
    </div>
  )
}
