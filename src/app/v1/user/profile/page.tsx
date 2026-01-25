import Link from "next/link"
import { RoundedFrame } from "@/components/atoms/RoundedFrame"
import { UserProfileFrame } from "@/components/organisms/UserProfileFrame"
import { STATICS } from "@/lib/statics"
import { UserQuitDialog } from "@/components/molecules/UserQuitDialog"

export default function Page() {
  return (
    <div className='bg-background min-h-screen text-text font-sans p-8'>
      <UserProfileFrame />

      <RoundedFrame className='mt-8'>
        <h1 className='text-2xl font-bold mb-6 select-none'>
          その他アクション
        </h1>

        <div className='select-none'>
          <p>
            <UserQuitDialog />
          </p>

          <p>
            <span className='font-bold'>問い合わせ</span>:&nbsp;
            <Link
              href={STATICS.GOOGLE_CONTACT_FORM_URL}
              target='_blank'
              className='underline'
            >
              Googleフォーム
            </Link>
          </p>
        </div>
      </RoundedFrame>

      <RoundedFrame className='mt-8'>
        <h1 className='text-2xl font-bold mb-6 select-none'>
          このアプリについて
        </h1>

        <div className='select-none'>
          <p>
            <span className='font-bold'>開発者</span>:&nbsp;{STATICS.APP_OWNER}
          </p>

          <p>
            <span className='font-bold'>バージョン</span>:&nbsp;
            {STATICS.APP_VERSION}
          </p>
        </div>
      </RoundedFrame>
    </div>
  )
}
