import { SchoolBase } from "@/lib/types/base/schoolTypes"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type School = { schoolId: string; schoolName: string } & Omit<
  SchoolBase,
  "description" | "name"
>

type ManageState = {
  schoolId: string
  setSchoolId: (schoolId: string) => void
  clearSchoolId: () => void

  schools: School[]
  setSchools: (schools: School[]) => void
}

export const useManageStore = create(
  persist<ManageState>(
    (set) => ({
      schoolId: "",
      setSchoolId: (schoolId) => set({ schoolId }),
      clearSchoolId: () => set({} as ManageState),

      schools: [],
      setSchools: (schools) => set({ schools }),
    }),
    {
      name: "manage-storage-kaitopia",
    },
  ),
)
