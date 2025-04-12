import { ApiV1Error } from "../common/ApiV1Error"
import { ExerciseRepository } from "../repositories/ExerciseRepository"

export class ExerciseService {
  constructor(private exerciseRepository: ExerciseRepository) {}

  public static getInstance(
    ...args: ConstructorParameters<typeof ExerciseRepository>
  ): ExerciseService {
    return new ExerciseService(new ExerciseRepository(...args))
  }

  public async getRecommendExercises() {
    const recommendExercises =
      await this.exerciseRepository.findExerciseInGlobalSchool(10)
    return recommendExercises.map((exercise) => {
      return {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
      }
    })
  }

  public async getExerciseById(exerciseId: string) {
    const exercise = await this.exerciseRepository.findExerciseById(exerciseId)
    if (!exercise)
      throw new ApiV1Error([{ key: "NotFoundError", params: null }])

    return exercise
  }
}
