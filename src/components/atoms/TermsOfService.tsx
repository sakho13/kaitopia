import React from "react"

export function TermsOfService() {
  return (
    <>
      <h1 className='text-3xl font-bold mb-4'>利用規約</h1>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第1条（適用）</h2>
        <p>
          この利用規約（以下，「本規約」といいます。）は，Kaitopia（以下，「本サービス」といいます。）の提供条件および運営者と利用者との間の権利義務関係を定めるものです。本サービスをご利用いただく際は，本規約に同意いただく必要があります。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第2条（登録）</h2>
        <p>
          本サービスの利用希望者は，運営者の定める方法により登録を申請し，運営者がこれを承認した時点で利用契約が成立します。登録に際して虚偽の情報を申請してはなりません。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第3条（アカウント管理）</h2>
        <p>
          利用者は，自己の責任においてアカウント情報を管理するものとし，第三者に譲渡・貸与してはなりません。アカウントの不正利用によって利用者に生じた損害について，運営者は責任を負いません。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          第4条（ユーザー生成コンテンツ）
        </h2>
        <p>
          本サービスでは，利用者が問題や解説などのコンテンツ（以下，「ユーザーコンテンツ」といいます。）を投稿できます。利用者は，ユーザーコンテンツについて適法な権利を有していることを保証し，第三者の権利を侵害しないものとします。
        </p>
        <p className='mt-2'>
          利用者が投稿したユーザーコンテンツは
          <a
            href='https://creativecommons.org/publicdomain/zero/1.0/deed.ja'
            target='_blank'
            className='underline'
          >
            CC0 1.0
          </a>
          の下で公開され，運営者および他の利用者が自由に複製，改変，配布等を行うことができます。利用者は当該コンテンツに関する著作者人格権を行使しないものとします。
        </p>
        <p>
          運営者は，必要と判断した場合，ユーザーコンテンツを削除できるものとします。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第5条（禁止事項）</h2>
        <p>
          利用者は，本サービスの利用にあたり，以下の行為をしてはなりません。
        </p>
        <ul className='list-disc pl-5'>
          <li>法令または公序良俗に反する行為</li>
          <li>他者の知的財産権を侵害する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>不正確または不適切な学習コンテンツを投稿する行為</li>
        </ul>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          第6条（サービスの提供の停止等）
        </h2>
        <p>
          運営者は，システムの保守点検，障害発生，天災その他やむを得ない事由があると判断した場合，利用者に事前に通知することなく，本サービスの全部または一部の提供を停止・中断できるものとします。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第7条（免責事項）</h2>
        <p>
          運営者は，本サービスが学習支援を目的として提供されるものであり，内容の正確性・安全性・有用性等について一切保証いたしません。利用者が本サービスを利用したことにより生じた損害について，運営者は責任を負いません。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第8条（著作権）</h2>
        <p>
          本サービスに掲載される文章・画像・プログラムその他一切の情報に関する著作権およびその他の権利は，運営者または正当な権利者に帰属します。権利者の許可なくこれらを利用してはなりません。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          第9条（利用制限および登録抹消）
        </h2>
        <p>
          運営者は，利用者が本規約に違反したと判断した場合，事前の通知なく，投稿データの削除，利用の停止または登録の抹消等の措置を講じることができます。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第10条（退会）</h2>
        <p>
          利用者は，運営者の定める手続により，いつでも本サービスを退会できます。退会後も，利用者が投稿したユーザーコンテンツは削除されない場合があります。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>第11条（規約の変更）</h2>
        <p>
          運営者は，必要と判断した場合，利用者に通知することなくいつでも本規約を変更できます。変更後に本サービスを利用した場合，利用者は変更後の規約に同意したものとみなします。
        </p>
      </section>

      <section className='mb-6'>
        <h2 className='text-xl font-semibold mb-2'>
          第12条（準拠法・裁判管轄）
        </h2>
        <p>
          本規約の解釈には日本法を準拠法とし，本サービスに関して紛争が生じた場合には，運営者の住所地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </section>
    </>
  )
}
