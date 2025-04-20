"use client"

import { useEffect, useState } from "react"
import { onIdTokenChanged } from "firebase/auth"
import { firebaseAuthClient } from "@/lib/functions/firebaseClient"
import { useAuthStore } from "./stores/useAuthStore"
import { useUserConfigStore } from "./stores/useUserConfigStore"
import { useGetUserConfig } from "./useApiV1"

export function useAuth() {
  const { setAuth, clearAuth, idToken, user } = useAuthStore.getState()
  const { clearConfig, setConfig } = useUserConfigStore.getState()
  const { refetchUserConfig, dataTooGetUserConfig } = useGetUserConfig(idToken)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      firebaseAuthClient,
      async (firebaseUser) => {
        if (firebaseUser) {
          setAuth(firebaseUser, (await firebaseUser?.getIdToken()) ?? "")
          refetchUserConfig()
        } else {
          clearAuth()
          clearConfig()
        }

        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [clearAuth, setAuth, clearConfig, refetchUserConfig])

  useEffect(() => {
    refetchUserConfig()
      .then((r) => {
        if (r?.success) {
          setConfig(r.data)
        } else {
          clearConfig()
        }
      })
      .catch(() => {
        clearConfig()
      })
  }, [clearConfig, dataTooGetUserConfig, refetchUserConfig, setConfig])

  return { user, idToken, loading }
}
