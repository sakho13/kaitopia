"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useAnalytics } from "@/hooks/useAnalytics"

export function FirebaseAnalytics() {
  const { sendAnalyticsEvent } = useAnalytics()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    sendAnalyticsEvent("pageView", {
      page_location: window.location.href,

      pathname,
      search_params: searchParams.toString(),

      page_title: document.title,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  return null
}
