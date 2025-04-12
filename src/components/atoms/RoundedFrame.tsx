type Props = {
  children: React.ReactNode
  className?: string
}

export function RoundedFrame({ children, className }: Props) {
  return (
    <div
      className={`max-w-xl mx-auto bg-white p-6 rounded-2xl shadow ${className}`}
    >
      {children}
    </div>
  )
}
