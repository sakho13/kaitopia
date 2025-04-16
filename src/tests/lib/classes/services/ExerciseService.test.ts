import { ExerciseService } from "@/lib/classes/services/ExerciseService"
import { PrismaClient } from "@prisma/client"

describe("lib/classes/services/ExerciseService", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getRecommendExercises", () => {
    test("おすすめ問題集なし", async () => {
      const connection = {
        exercise: {
          findMany: jest.fn().mockResolvedValueOnce([]),
        },
      }
      const exerciseService = new ExerciseService(
        connection as unknown as PrismaClient,
      )

      const recommendExercises = await exerciseService.getRecommendExercises()
      expect(recommendExercises).toEqual([])
    })

    test("おすすめ問題集あり", async () => {
      const connection = {
        exercise: {
          findMany: jest.fn().mockResolvedValueOnce([
            {
              id: "testId",
              title: "testTitle",
              description: "testDescription",
            },
          ]),
        },
      }
      const exerciseService = new ExerciseService(
        connection as unknown as PrismaClient,
      )

      const recommendExercises = await exerciseService.getRecommendExercises()
      expect(recommendExercises).toEqual([
        {
          id: "testId",
          title: "testTitle",
          description: "testDescription",
        },
      ])
    })
  })
})
