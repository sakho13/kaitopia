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

  describe("getExercisesForManage", () => {
    test("問題集なし", async () => {
      const connection = {
        exercise: {
          findMany: jest.fn().mockResolvedValueOnce([]),
        },
      }
      const exerciseService = new ExerciseService(
        connection as unknown as PrismaClient,
      )

      const exercises = await exerciseService.getExercisesForManage()
      expect(exercises).toEqual([])
    })

    test("問題集あり", async () => {
      const connection = {
        exercise: {
          findMany: jest.fn().mockResolvedValueOnce([
            {
              id: "testId",
              title: "testTitle",
              description: "testDescription",
              createdAt: new Date(),
              updatedAt: new Date(),
              isCanSkip: false,
              isScoringBatch: false,
            },
            {
              id: "testId2",
              title: "testTitle2",
              description: "testDescription2",
              createdAt: new Date(),
              updatedAt: new Date(),
              isCanSkip: true,
              isScoringBatch: true,
            },
          ]),
        },
      }
      const exerciseService = new ExerciseService(
        connection as unknown as PrismaClient,
      )

      const exercises = await exerciseService.getExercisesForManage()
      expect(exercises).toEqual([
        {
          schoolId: undefined,
          exerciseId: "testId",
          title: "testTitle",
          description: "testDescription",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          isCanSkip: false,
          isScoringBatch: false,
        },
        {
          schoolId: undefined,
          exerciseId: "testId2",
          title: "testTitle2",
          description: "testDescription2",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          isCanSkip: true,
          isScoringBatch: true,
        },
      ])
    })
  })
})
