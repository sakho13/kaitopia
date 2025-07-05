import { remark } from "remark"
import RemarkHtml from "remark-html"
import RemarkMath from "remark-math"
import RemarkRehype from "remark-rehype"
import RemarkParse from "remark-parse"
import RehypeKaTex from "rehype-katex"
import RehypeStringify from "rehype-stringify"
import { useEffect, useState } from "react"

type Props = {
  md: string
}

export function useConvertMd({ md }: Props) {
  const [html, setHtml] = useState<string>("")

  useEffect(() => {
    remark()
      .use(RemarkParse)
      .use(RemarkMath)
      .use(RemarkHtml)
      .use(RemarkRehype)
      .use(RehypeKaTex)
      .use(RehypeStringify)
      .process(md)
      .then((file) => {
        setHtml(String(file))
      })
  }, [md])

  return {
    html,
  }
}
