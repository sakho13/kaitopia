import { joincn } from "@/lib/functions/joincn"
import Link from "next/link"

type Props = {
  href?: string
  className?: string
}

export function KaitopiaTitle({
  href = "/v1/user",
  className = "text-2xl",
}: Props) {
  return (
    <Link
      href={href}
      className={joincn(
        "font-bold select-none hover:cursor-pointer",
        className,
      )}
    >
      Kaitopia
    </Link>
  )
}
