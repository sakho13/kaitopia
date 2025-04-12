import { SectionTitle } from "../atoms/SectionTitle"

type Props = {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function UserLayoutSection({ title, action, children }: Props) {
  return (
    <section className='mb-8'>
      <div className='flex justify-between'>
        <SectionTitle title={title} />

        {action && <div className='text-right mb-4 mr-8'>{action}</div>}
      </div>

      {children}
    </section>
  )
}
