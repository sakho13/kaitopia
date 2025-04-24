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

const requestPost = async <
  T extends keyof ApiV1InTypeMap,
  K extends keyof ApiV1OutTypeMap,
>(
  _in: T,
  _out: K,
  url: string,
  token: string,
  input: ApiV1InTypeMap[T],
) =>
  fetch(url, {
    method: "POST",
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
  const PAGE_SIZE = 10
  const { idToken } = useAuth()

  const getKey = (
    pageIndex: number,
    previousPageData: ApiV1OutTypeMap["GetManageExercises"] | null,
  ) => {
    if (!idToken) return null

    const isFirstFetch = pageIndex === 0
    if (isFirstFetch)
      return [
        `/api/manage/v1/exercises?schoolId=${schoolId}&page=1&count=${PAGE_SIZE}`,
        idToken,
      ]

    if (previousPageData?.nextPage === null || !previousPageData) return null

    const page = pageIndex === 0 ? 1 : pageIndex + 1
    return [
      `/api/manage/v1/exercises?schoolId=${schoolId}&page=${page}&count=${PAGE_SIZE}`,
      idToken,
    ]
  }

  const { data, isLoading, mutate, size, setSize, isValidating } =
    useSWRInfinite(getKey, async ([url, token]) =>
      token ? fetcher("GetManageExercises", "GET", url, token) : null,
    )

  return {
    dataTooGetManageExercises:
      data?.flatMap((page) => (page?.success ? page.data.exercises : [])) ?? [],
    totalCountToGetManageExercises:
      data && data[0]?.success ? data[0].data.totalCount : 0,
    isLoadingToGetManageExercises: isLoading,
    isValidatingToGetManageExercises: isValidating,
    sizeToGetManageExercises: size,
    setSizeToGetManageExercises: setSize,
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
    return await requestPost(
      "PostManageExercise",
      "PostManageExercise",
      "/api/manage/v1/exercise",
      idToken ?? "",
      input,
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
    ["/api/manage/v1/exercise", idToken],
    async ([url, token]) =>
      token
        ? fetcher(
            "GetManageExercise",
            "GET",
            `${url}?exerciseId=${exerciseId}`,
            token,
          )
        : null,
  )

  return {
    dataTooGetManageExercise: data,
    isLoadingToGetManageExercise: isLoading,
    refetchManageExercise: mutate,
  } as const
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
    return await requestPost(
      "PostUserLogin",
      "PostUserLogin",
      "/api/user/v1/login",
      token,
      null,
    )
  }

  return {
    requestPostLogin,
  }
}

// export function useGetExercise(exerciseId: string) {
//   const { idToken } = useAuth()
//   const [loading, setLoading] = useState(true)

//   return {
//     isLoadingToGetExercise: loading,
//   }
// }
