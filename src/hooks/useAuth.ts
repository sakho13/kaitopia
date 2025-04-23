"use client"

import { useCallback, useEffect, useState } from "react"
import { onIdTokenChanged } from "firebase/auth"
import { firebaseAuthClient } from "@/lib/functions/firebaseClient"
import { handleLogoutByFirebase } from "@/lib/functions/firebaseActions"
import { useAuthStore } from "./stores/useAuthStore"
import { useUserConfigStore } from "./stores/useUserConfigStore"
import { useGetUserConfig } from "./useApiV1"

export function useAuth() {
  const { setAuth, clearAuth, idToken, user } = useAuthStore.getState()
  const { clearConfig, setConfig } = useUserConfigStore.getState()
  const { refetchUserConfig } = useGetUserConfig(idToken)

  const [loading, setLoading] = useState(true)

  const onChangeLoading = (loading: boolean) => setLoading(loading)

  const fetchUserConfig = useCallback(() => {
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
  }, [refetchUserConfig, setConfig, clearConfig])

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(
      firebaseAuthClient,
      async (firebaseUser) => {
        if (firebaseUser) {
          setAuth(firebaseUser, (await firebaseUser?.getIdToken()) ?? "")
          fetchUserConfig()
        } else {
          clearAuth()
          clearConfig()
        }

        setLoading(false)
      },
    )
    return () => {
      unsubscribe()
    }
  }, [clearAuth, setAuth, clearConfig, fetchUserConfig])

  const signOut = async () => {
    setLoading(true)
    await handleLogoutByFirebase()
    clearAuth()
    clearConfig()
    setLoading(false)
  }

  return { user, idToken, loading, signOut, onChangeLoading }
}
