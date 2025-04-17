import useSwr from "swr"
import useSWRImmutable from "swr/immutable"
import { useAuth } from "./useAuth"
import { ApiV1OutBase, ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { useState } from "react"

const fetcher = async <T extends keyof ApiV1OutTypeMap>(
  _label: T,
  method: string,
  url: string,
  token: string,
) =>
  fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) return res.json()
    return res.json()
  }) as Promise<ApiV1OutBase<ApiV1OutTypeMap[T]>>

// *******************
//      common
// *******************

/**
 * GET: `/api/common/v1/recommend-exercise`
 */
export function useGetRecommendExercises() {
  const { idToken } = useAuth()

  const { data, isLoading } = useSWRImmutable(
    ["/api/common/v1/recommend-exercise", idToken],
    async ([url, token]) =>
      token ? fetcher("GetRecommendExercise", "GET", url, token) : null,
  )

  return {
    dataTooGetRecommendExercises: data,
    isLoadingToGetRecommendExercises: isLoading,
  } as const
}

// *******************
//      manage
// *******************

/**
 * GET: `/api/manage/v1/exercises`
 */
export function useGetManageExercises() {
  const { idToken } = useAuth()

  const { data, isLoading } = useSwr(
    ["/api/manage/v1/exercises", idToken],
    async ([url, token]) =>
      token ? fetcher("GetManageExercises", "GET", url, token) : null,
  )

  return {
    dataTooGetManageExercises: data,
    isLoadingToGetManageExercises: isLoading,
  }
}

// *******************
//      user
// *******************

/**
 * GET: `/api/user/v1/user-config`
 */
export function useGetUserConfig() {
  const { idToken } = useAuth()

  const { data, isLoading, mutate } = useSWRImmutable(
    ["/api/user/v1/user-config", idToken],
    async ([url, token]) =>
      token ? fetcher("GetUserConfig", "GET", url, token) : null,
  )

  return {
    dataTooGetUserConfig: data,
    isLoadingToGetUserConfig: isLoading,
    refetchUserConfig: mutate,
  } as const
}

export function useGetExercise(exerciseId: string) {
  const { idToken } = useAuth()
  const [loading, setLoading] = useState(true)

  return {
    isLoadingToGetExercise: loading,
  }
}
