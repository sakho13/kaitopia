export default function Home() {
  return (
    <div className='bg-background text-text font-sans'>
      {/* Hero */}
      <section className='bg-primary text-text-on-color py-20 px-4 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          学びの未来を、もっと楽しくスマートに。
        </h1>
        <p className='text-lg md:text-xl mb-8'>
          Kaitopiaは、学習者と教育者のためのe-learningプラットフォームです。
        </p>
        <button className='bg-white text-primary font-bold py-3 px-6 rounded-full shadow hover:bg-gray-100 transition'>
          無料で始める
        </button>
      </section>

      {/* Features */}
      <section className='py-16 px-6 max-w-6xl mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-12'>主な機能</h2>
        <div className='grid md:grid-cols-2 gap-10'>
          <div className='bg-background-subtle p-6 rounded-2xl shadow hover:shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>🧠 自動問題生成</h3>
            <p>
              OpenAI API
              を活用し、スキルやテーマに応じた問題を自動で生成します。
            </p>
          </div>
          <div className='bg-background-subtle p-6 rounded-2xl shadow hover:shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              📊 スキル評価と進捗確認
            </h3>
            <p>
              回答データをもとに学習者のスキルを見える化。モチベーションアップにも貢献。
            </p>
          </div>
          <div className='bg-background-subtle p-6 rounded-2xl shadow hover:shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              👥 ユーザー・グループ管理
            </h3>
            <p>
              管理者は学習グループの作成、進捗管理、レポート出力が可能です。
            </p>
          </div>
          <div className='bg-background-subtle p-6 rounded-2xl shadow hover:shadow-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              📝 テスト・模試モード
            </h3>
            <p>試験前対策にぴったりの模擬テスト機能を用意しています。</p>
          </div>
        </div>
      </section>

      {/* Use Case */}
      <section className='bg-white py-16 px-6'>
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-3xl font-bold mb-6'>こんな場面で活躍！</h2>
          <div className='grid md:grid-cols-3 gap-8 mt-8'>
            <div>
              <h3 className='text-xl font-semibold mb-2'>🏫 小・中・高校</h3>
              <p>教科別の反復問題で基礎力を強化。</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>🎓 大学・資格試験</h3>
              <p>AIが弱点を分析し、個別対策を提供。</p>
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>🏢 企業研修</h3>
              <p>業務スキルの確認やeラーニング教材として活用。</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='bg-smart text-white py-20 px-4 text-center'>
        <h2 className='text-3xl md:text-4xl font-bold mb-6'>
          今すぐKaitopiaを使ってみよう！
        </h2>
        <p className='mb-6'>
          最初の30日間は無料。法人・個人問わずご利用いただけます。
        </p>
        <button className='bg-white text-smart font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition'>
          サインアップする
        </button>
      </section>

      {/* Footer */}
      <footer className='bg-primary text-text-on-color text-center p-6 mt-10'>
        <p>© 2025 Kaitopia Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}
