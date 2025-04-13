import useSwr from "swr"
import useSWRImmutable from "swr/immutable"
import { useAuth } from "./useAuth"
import { ApiV1OutBase, ApiV1OutTypeMap } from "@/lib/types/apiV1Types"

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

export function useGetExercises() {}
