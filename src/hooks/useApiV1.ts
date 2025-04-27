import useSwr from "swr"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { useAuth } from "./useAuth"
import {
  ApiV1InTypeMap,
  ApiV1OutBase,
  ApiV1OutTypeMap,
} from "@/lib/types/apiV1Types"

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

const requestHttp = async <
  T extends keyof ApiV1InTypeMap,
  K extends keyof ApiV1OutTypeMap,
>(
  _in: T,
  _out: K,
  url: string,
  token: string,
  input: ApiV1InTypeMap[T],
  method: "POST" | "PATCH" | "DELETE",
) =>
  fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  }).then((res) => {
    if (!res.ok) return res.json()
    return res.json()
  }) as Promise<ApiV1OutBase<ApiV1OutTypeMap[K]>>

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
 * GET: `/api/manage/v1/own-schools`
 */
export function useGetManageOwnSchools() {
  const { idToken } = useAuth()

  const { data, isLoading, mutate } = useSWRImmutable(
    ["/api/manage/v1/own-schools", idToken],
    async ([url, token]) =>
      token ? fetcher("GetManageOwnSchools", "GET", url, token) : null,
  )

  return {
    dataToGetOwnSchools: data,
    isLoadingToGetOwnSchools: isLoading,
    refetchOwnSchools: mutate,
  } as const
}

/**
 * GET: `/api/manage/v1/exercises`
 */
export function useGetManageExercises(schoolId: string) {
  const PAGE_SIZE = 20
  const { idToken } = useAuth()

  const getKey = (
    pageIndex: number,
    previousPageData: ApiV1OutTypeMap["GetManageExercises"] | null,
  ) => {
    if (!idToken) return null

    const isFirstFetch = pageIndex === 0
    if (isFirstFetch)
      return [
        `/api/manage/v1/exercises?schoolId=${schoolId}&count=${PAGE_SIZE}&page=1`,
        idToken,
      ]

    if (previousPageData?.nextPage === null || !previousPageData) return null

    const page = pageIndex + 1
    return [
      `/api/manage/v1/exercises?schoolId=${schoolId}&count=${PAGE_SIZE}&page=${page}`,
      idToken,
    ]
  }

  const { data, isLoading, mutate, setSize, isValidating } = useSWRInfinite(
    getKey,
    async ([url, token]) =>
      token ? fetcher("GetManageExercises", "GET", url, token) : null,
  )

  const loadMore = () => {
    if (isLoading || isValidating) return
    if (!data) {
      setSize(1)
      return
    }
    const latest = data[data.length - 1]
    if (!latest?.success) {
      setSize(1)
      return
    }
    if (latest.data.nextPage === null) return
    setSize((prev) => (prev ? prev + 1 : 1))
  }

  return {
    dataTooGetManageExercises: data
      ? data.flatMap((d) => (d?.success ? d.data.exercises : []))
      : [],
    totalCountToGetManageExercises:
      data && data[0]?.success ? data[0].data.totalCount : 0,
    isLoadingToGetManageExercises: isLoading || isValidating,
    loadMoreToGetManageExercises: loadMore,
    refetchManageExercises: mutate,
  }
}

/**
 * POST: `/api/manage/v1/exercise`
 */
export function usePostManageExercise() {
  const { idToken } = useAuth()

  const requestPostExercise = async (
    input: ApiV1InTypeMap["PostManageExercise"],
  ) => {
    return await requestHttp(
      "PostManageExercise",
      "PostManageExercise",
      "/api/manage/v1/exercise",
      idToken ?? "",
      input,
      "POST",
    )
  }

  return {
    requestPostExercise,
  }
}

/**
 * GET: `/api/manage/v1/exercise`
 */
export function useGetManageExercise(exerciseId: string) {
  const { idToken } = useAuth()

  const { data, isLoading, mutate } = useSWRImmutable(
    ["/api/manage/v1/exercise", idToken, exerciseId],
    async ([url, token, eid]) =>
      token
        ? fetcher("GetManageExercise", "GET", `${url}?exerciseId=${eid}`, token)
        : null,
  )

  return {
    dataToGetManageExercise: data,
    isLoadingToGetManageExercise: isLoading,
    refetchManageExercise: mutate,
  } as const
}

/**
 * PATCH: `/api/manage/v1/exercise`
 */
export function usePatchManageExercise() {
  const { idToken } = useAuth()

  const requestPatchExercise = async (
    exerciseId: string,
    input: ApiV1InTypeMap["PatchManageExercise"],
  ) => {
    return await requestHttp(
      "PatchManageExercise",
      "PatchManageExercise",
      `/api/manage/v1/exercise?exerciseId=${exerciseId}`,
      idToken ?? "",
      input,
      "PATCH",
    )
  }

  return {
    requestPatchExercise,
  }
}

/**
 * DELETE: `/api/manage/v1/exercise?exerciseId=xxxxx`
 * @returns
 */
export function useDeleteManageExercise() {
  const { idToken } = useAuth()

  const requestDeleteExercise = async (exerciseId: string) =>
    requestHttp(
      "DeleteManageExercise",
      "DeleteManageExercise",
      `/api/manage/v1/exercise?exerciseId=${exerciseId}`,
      idToken ?? "",
      null,
      "DELETE",
    )

  return { requestDeleteExercise }
}

// *******************
//      user
// *******************

/**
 * GET: `/api/user/v1/user-config`
 */
export function useGetUserConfig(token: string | null) {
  const { data, isLoading, mutate } = useSwr(
    ["/api/user/v1/user-config", token],
    async ([url, token]) =>
      token ? fetcher("GetUserConfig", "GET", url, token) : null,
  )

  return {
    dataTooGetUserConfig: data,
    isLoadingToGetUserConfig: isLoading,
    refetchUserConfig: mutate,
  } as const
}

/**
 * GET: `/api/user/v1/info`
 */
export function useGetUserInfo() {
  const { idToken } = useAuth()
  const { data, isLoading, mutate } = useSWRImmutable(
    ["/api/user/v1/info", idToken],
    async ([url, token]) =>
      token ? fetcher("GetUserInfo", "GET", url, token) : null,
  )

  return {
    dataTooGetUserInfo: data,
    isLoadingToGetUserInfo: isLoading,
    refetchUserInfo: mutate,
  } as const
}

/**
 * POST: `/api/user/v1/login`
 */
export function usePostUserLogin() {
  const requestPostLogin = async (token: string) => {
    return await requestHttp(
      "PostUserLogin",
      "PostUserLogin",
      "/api/user/v1/login",
      token,
      null,
      "POST",
    )
  }

  return {
    requestPostLogin,
  }
}

/**
 * GET: `/api/user/v1/exercise?exerciseId=xxxxx`
 */
export function useGetUserExercise(exerciseId: string) {
  const { idToken } = useAuth()

  const { data, isLoading, mutate } = useSWRImmutable(
    ["/api/user/v1/exercise", idToken, exerciseId],
    async ([url, token, eid]) =>
      token && eid
        ? fetcher(
            "GetUserExerciseInfo",
            "GET",
            `${url}?exerciseId=${eid}`,
            token,
          )
        : null,
  )

  return {
    dataToGetUserExercise: data,
    isLoadingToGetUserExercise: isLoading,
    refetchUserExercise: mutate,
  } as const
}
