import { ApiV1OutTypeMap } from "@/lib/types/apiV1Types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserConfig = {
  config: ApiV1OutTypeMap["GetUserConfig"]
  setConfig: (config: ApiV1OutTypeMap["GetUserConfig"]) => void
  clearConfig: () => void
}

export const useUserConfigStore = create(
  persist<UserConfig>(
    (set) => ({
      config: {} as ApiV1OutTypeMap["GetUserConfig"],
      setConfig: (config) => set({ config }),
      clearConfig: () =>
        set({ config: {} as ApiV1OutTypeMap["GetUserConfig"] }),
    }),
    { name: "user-config-kaitopia" },
  ),
)
