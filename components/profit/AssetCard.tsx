'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Pencil } from 'lucide-react' // 아이콘 임포트

type Props = {
  monthlyAmount: number; // 이번 달 수익
  totalAmount: number;   // 총 누적 수익
}

export default function AssetCard({ monthlyAmount, totalAmount }: Props) {
  
  // 목표 금액 (나중에 DB에서 불러오도록 수정 가능)
  const GOAL_AMOUNT = 1000000; // 100만원
  const GOAL_TITLE = "제주도 효도 여행";

  // 치킨 지수 계산 (2만원 기준)
  const chickenCount = Math.floor(totalAmount / 20000);

  // 달성률 계산 (최대 100%)
  const progressPercent = Math.min((totalAmount / GOAL_AMOUNT) * 100, 100);

  return (
    <div className="space-y-2">
      {/* 1. 섹션 타이틀 (파란색 세로줄) */}
      <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm ml-1">
        나의 자산 현황
      </div>

      {/* 2. 메인 카드 */}
      <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6 text-center space-y-6">
          
          {/* --- [A] 이번 달 수익 (핵심) --- */}
          <div>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-2">
              <CalendarDays className="w-4 h-4" /> 이번 달 수익
            </p>
            {/* 시니어를 위한 압도적인 폰트 사이즈 (text-5xl) */}
            <h2 className="text-5xl font-black text-red-500 tracking-tight leading-none">
              +{monthlyAmount.toLocaleString()}
              <span className="text-3xl font-bold text-gray-400 ml-1">원</span>
            </h2>
            {/* 칭찬 뱃지 */}
            <div className="mt-3 inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
              {monthlyAmount > 0 
                ? "정말 잘하고 계시네요! 👏" 
                : "첫 기록을 시작해보세요! 🌱"}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>

          {/* --- [B] 누적 수익 & 치킨 지수 --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center border-r border-gray-100">
              <p className="text-xs text-gray-400 mb-1">총 누적 수익</p>
              <h3 className="text-lg font-bold text-gray-800">
                +{totalAmount.toLocaleString()}원
              </h3>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">치킨 가능</p>
              <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-1">
                🍗 {chickenCount}마리
              </h3>
            </div>
          </div>

          {/* --- [C] 목표 달성 그래프 --- */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold">
              <span className="flex items-center gap-1">
                🌴 {GOAL_TITLE} ({GOAL_AMOUNT.toLocaleString()}원)
              </span>
              <button className="text-gray-400 hover:text-blue-500 transition-colors">
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            
            {/* 게이지 바 */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-600 font-bold">
                {progressPercent.toFixed(1)}% 달성
              </p>
              <p className="text-[10px] text-gray-400">
                {(GOAL_AMOUNT - totalAmount) > 0 
                  ? `${(GOAL_AMOUNT - totalAmount).toLocaleString()}원 남음` 
                  : "목표 달성! 🎉"}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}