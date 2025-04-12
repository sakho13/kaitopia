"use client"

import { useEffect, useState } from "react"
import { onIdTokenChanged } from "firebase/auth"
import { firebaseAuthClient } from "@/lib/functions/firebaseClient"
import { useAuthStore } from "./stores/useAuthStore"

export function useAuth() {
  const { setAuth, clearAuth, idToken, user } = useAuthStore.getState()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      firebaseAuthClient,
      async (firebaseUser) => {
        if (firebaseUser) {
          setAuth(firebaseUser, (await firebaseUser?.getIdToken()) ?? "")
        } else {
          clearAuth()
        }

        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [clearAuth, setAuth])

  return { user, idToken, loading }
}
