"use client"

import { useState } from "react"
import { UserLayoutSection } from "../molecules/UserLayoutSection"
import { encodeBase64 } from "@/lib/functions/encodeBase64"
import { joincn } from "@/lib/functions/joincn"
import { useRouter } from "next/navigation"

export function UserRecommendExerciseSection() {
  const router = useRouter()
  const [recommendExercises, setRecommendExercises] = useState([
    {
      id: "intro_programming_1",
      title: "プログラミング入門",
      description: "入門者向けのプログラミング問題集",
    },
    {
      id: "fundamental_information_technology_engineer_exam_1",
      title: "基本情報技術者試験 問題集1",
      description: "基本情報技術者試験の問題集",
    },
  ])

  return (
    <UserLayoutSection
      title='おすすめの問題集'
      action={
        <button
          className='text-sm text-primary hover:text-primary-hover font-bold cursor-pointer'
          onClick={() => router.push(`/v1/user/exercise`)}
        >
          もっと見る
        </button>
      }
    >
      <div className='flex gap-x-3'>
        {recommendExercises.map((exercise) => (
          <div
            key={encodeBase64(exercise.id)}
            className={joincn(
              `bg-background-subtle p-4 rounded-2xl shadow w-[300px]`,
              `hover:shadow-lg transition`,
              `cursor-pointer`,
            )}
            onClick={() =>
              router.push(`/v1/user/exercise?eid=${encodeBase64(exercise.id)}`)
            }
          >
            <h3 className='text-lg font-bold mb-2'>{exercise.title}</h3>
            <p className='text-sm'>{exercise.description}</p>
          </div>
        ))}
      </div>
    </UserLayoutSection>
  )
}
