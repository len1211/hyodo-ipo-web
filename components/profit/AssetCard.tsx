'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Pencil } from 'lucide-react'

type Props = {
  monthlyAmount: number;
  totalAmount: number;
  goalTitle: string;
  goalAmount: number;
  onEditGoal: () => void;
  // 👇 [추가] 시작점 데이터 (옵셔널, 기본값 0)
  goalStartAmount?: number; 
}

export default function AssetCard({ 
  monthlyAmount, 
  totalAmount, 
  goalTitle, 
  goalAmount, 
  onEditGoal,
  goalStartAmount = 0 // 기본값 0원으로 설정
}: Props) {
  
  // 1. 목표 금액 안전장치 (0원 나누기 방지)
  const safeGoalAmount = goalAmount || 1;

  // 2. [핵심 로직 변경] 
  // 현재 진행된 금액 = (현재 총 누적액 - 목표 설정 당시 누적액)
  // Math.max(0, ...)을 써서 혹시라도 마이너스가 나오지 않게 방지
  const currentProgress = Math.max(0, totalAmount - goalStartAmount);

  // 3. 퍼센트 계산
  const progressPercent = Math.min((currentProgress / safeGoalAmount) * 100, 100);

  // 4. 남은 금액 계산
  const remainingAmount = Math.max(0, safeGoalAmount - currentProgress);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm ml-1">
        나의 자산 현황
      </div>

      <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6 text-center space-y-6">
          
          {/* [A] 이번달 수익 */}
          <div>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-2">
              <CalendarDays className="w-4 h-4" /> 이번 달 수익
            </p>
            <h2 className="text-5xl font-black text-red-500 tracking-tight leading-none">
              +{monthlyAmount.toLocaleString()}
              <span className="text-3xl font-bold text-gray-400 ml-1">원</span>
            </h2>
            <div className="mt-3 inline-block bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200">
              {monthlyAmount > 0 ? "잘하고 계시네요! 👏" : "첫 기록을 시작해보세요! 🌱"}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full"></div>
          
          {/* [B] 누적 수익 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center border-r border-gray-100">
              <p className="text-xs text-gray-400 mb-1">총 누적 수익</p>
              <h3 className="text-lg font-bold text-gray-800">+{totalAmount.toLocaleString()}원</h3>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">치킨 가능</p>
              <h3 className="text-lg font-bold text-gray-800">
                🍗 {Math.floor(totalAmount / 20000)}마리
              </h3>
            </div>
          </div>

          {/* [C] 목표 달성 그래프 (수정됨) */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold">
              {/* 목표 이름과 금액 표시 */}
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                🌴 {goalTitle || "목표를 설정해주세요"} ({goalAmount > 0 ? goalAmount.toLocaleString() : 0}원)
              </span>
              
              {/* 연필 버튼 */}
              <button onClick={onEditGoal} className="text-gray-400 hover:text-blue-500 p-1">
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                // 목표금액이 0원이면 그래프 0% 처리
                style={{ width: `${goalAmount > 0 ? progressPercent : 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-600 font-bold">
                {goalAmount > 0 ? progressPercent.toFixed(1) : 0}% 달성
              </p>
              
              <p className="text-[10px] text-gray-400">
                {goalAmount > 0 
                  ? (remainingAmount > 0 
                      ? `${remainingAmount.toLocaleString()}원 남음` 
                      : "🎉 목표 달성!")
                  : "새 목표를 세워보세요!"}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}