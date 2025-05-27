export default function MaintenancePage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen select-none'>
      <h1 className='font-bold text-2xl'>メンテナンス中です</h1>

      <p>
        {process.env.NEXT_PUBLIC_MAINTENANCE_MODE_MESSAGE ||
          "メンテナンス中です。復帰時期は公式アナウンスを確認してください。"}
      </p>
    </div>
  )
}
