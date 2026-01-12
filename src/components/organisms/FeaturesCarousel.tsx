"use client"

import CarouselAutoPlay from "embla-carousel-autoplay"
import { joincn } from "@/lib/functions/joincn"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { PopCard } from "../atoms/PopCard"

type FeatureItem = {
  title: string
  description: string

  status: "coming-soon" | "in-development" | "available" | null
  descriptionLink?: string
}

const FeatureList: FeatureItem[] = [
  {
    title: "📚 問題集",
    description: "多様な問題形式に対応した問題集を作成し、学習者に提供します。",
    status: "available",
    descriptionLink: "/public/ex/exercise",
  },
  {
    title: "👊 ゲストアカウント",
    description: "お試しで簡単に使い始められます。もちろん、無料で！",
    status: null,
  },
  {
    title: "📊 スキル評価と進捗確認",
    description:
      "回答データをもとに学習者のスキルを見える化。モチベーションアップにも貢献。",
    status: "coming-soon",
  },
  {
    title: "🧠 自動問題生成",
    description: "LLMを活用し、スキルやテーマに応じた問題を自動で生成します。",
    status: "in-development",
  },
  {
    title: "👥 ユーザー・グループ管理",
    description:
      "管理者は学習グループの作成、進捗管理、レポート出力が可能です。",
    status: "in-development",
  },
  {
    title: "📝 テスト・模試モード",
    description: "試験前対策にぴったりの模擬テスト機能を用意しています。",
    status: "in-development",
  },
]

export function FeaturesCarousel() {
  const plugins = useRef(CarouselAutoPlay({ delay: 3000 }))
  const router = useRouter()

  return (
    <Carousel
      className='w-full'
      plugins={[plugins.current]}
      onMouseEnter={() => plugins.current.stop()}
      onMouseLeave={() => plugins.current.reset()}
    >
      <CarouselContent>
        {FeatureList.map((feature, index) => (
          <CarouselItem
            key={`feature-${index}`}
            className='md:basis-1/3 h-[170px] relative'
          >
            <PopCard
              disableAnimate={!feature.descriptionLink}
              onClick={() =>
                feature.descriptionLink
                  ? router.push(feature.descriptionLink)
                  : undefined
              }
            >
              {feature.status === "coming-soon" && (
                <div
                  className={joincn(
                    "absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold py-1 px-2 rounded-full",
                    "transition cursor-default select-none",
                  )}
                >
                  Coming Soon
                </div>
              )}

              {feature.status === "in-development" && (
                <div
                  className={joincn(
                    "w-full h-full",
                    "absolute flex justify-center items-center",
                    "text-gray-800 text-4xl font-bold",
                    "transition cursor-default select-none",
                  )}
                >
                  <span>In Development</span>
                </div>
              )}

              <div
                className={joincn(
                  feature.status === "in-development" ? "opacity-50" : "",
                )}
              >
                <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </PopCard>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
