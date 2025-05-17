import { getFirebaseClientAnalytics } from "@/lib/functions/firebaseClient"
import { sendAnalyticsEvent } from "@/lib/functions/firebaseActions"

export function useAnalytics() {
  return {
    getFirebaseClientAnalytics,
    sendAnalyticsEvent,
  }
}
