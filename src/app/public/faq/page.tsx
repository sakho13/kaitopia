export default function Page() {
  const faqs = [
    {
      question: "サービスは無料で利用できますか？",
      answer: "基本機能は無料でご利用いただけます。将来的に有料プランを提供する可能性があります。",
    },
    {
      question: "ゲストアカウントはありますか？",
      answer: "メールアドレスを登録せずにゲストとしてログインできます。ゲストアカウントは5日後に削除されます。",
    },
    {
      question: "自分の問題集を作成できますか？",
      answer: "はい。ログイン後に問題集を作成し公開することが可能です。",
    },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>よくある質問</h1>
      <ul className='space-y-4'>
        {faqs.map((faq) => (
          <li key={faq.question}>
            <h2 className='font-semibold'>{faq.question}</h2>
            <p className='mt-1'>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
