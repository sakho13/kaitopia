import { KaitopiaTitle } from "@/components/atoms/KaitopiaTitle"
import UserPopover from "@/components/molecules/UserPopover"
import { GuestUserPop } from "@/components/organisms/GuestUserPop"

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

      <GuestUserPop />
      <main className='px-3 md:p-6 max-w-6xl mx-auto'>{children}</main>
    </div>
  )
}
