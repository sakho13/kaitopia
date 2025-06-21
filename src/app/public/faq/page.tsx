import { InfoArea } from "@/components/atoms/InfoArea"
import { STATICS } from "@/lib/statics"

type FAQ = {
  question: string
  answer: string
}

export default function Page() {
  const faqs: FAQ[] = [
    {
      question: "サービスは無料で利用できますか？",
      answer:
        "基本機能は無料でご利用いただけます。将来的に有料プランを提供する可能性があります。",
    },
    {
      question: "ゲストアカウントはありますか？",
      answer:
        "メールアドレスを登録せずにゲストとしてログインできます。ゲストアカウントは5日後に削除されます。",
    },
    {
      question: "自分の問題集を作成できますか？",
      answer:
        "現在のバージョンでは、コンテンツの作成機能は提供していません。将来的に機能を公開する予定です。",
    },
    {
      question: "開発者は誰ですか？",
      answer: `開発者は SaKho です。(GitHub: ${STATICS.OWNER_GITHUB_URL})`,
    },
  ]

  return (
    <InfoArea colorMode='white'>
      <h1 className='text-2xl font-bold mb-4 text-text'>よくある質問</h1>
      <ul className='space-y-4 px-2'>
        {faqs.map((faq, i) => (
          <li key={faq.question} className='text-text'>
            <h2 className='font-semibold'>
              {i + 1}. {faq.question}
            </h2>
            <p className='mt-1 px-2'>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </InfoArea>
  )
}
