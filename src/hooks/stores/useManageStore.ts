import { create } from "zustand"
import { persist } from "zustand/middleware"

type ManageState = {
  schoolId: string
  setSchoolId: (schoolId: string) => void
  clearSchoolId: () => void
}

export const useManageStore = create(
  persist<ManageState>(
    (set) => ({
      schoolId: "",
      setSchoolId: (schoolId) => set({ schoolId }),
      clearSchoolId: () => set({} as ManageState),
    }),
    {
      name: "manage-storage-kaitopia",
    },
  ),
)
