import { useConvertMd } from "@/hooks/useConvertMd"

export function PreviewMd({ md }: { md: string }) {
  const { html } = useConvertMd({ md })

  return (
    <div
      className='kaitopia-preview-md'
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
