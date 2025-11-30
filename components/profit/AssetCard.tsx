'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Pencil } from 'lucide-react'

type Props = {
  monthlyAmount: number;
  totalAmount: number;
  goalTitle: string;      // 👈 추가됨
  goalAmount: number;     // 👈 추가됨
  onEditGoal: () => void; // 👈 추가됨 (연필 누르면 실행될 함수)
}

export default function AssetCard({ 
  monthlyAmount, totalAmount, goalTitle, goalAmount, onEditGoal 
}: Props) {
  
  // 목표 금액이 0이면 나눗셈 에러 나니까 1로 처리
  const safeGoalAmount = goalAmount || 1;
  const progressPercent = Math.min((totalAmount / safeGoalAmount) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm ml-1">
        <span>|</span> 나의 자산 현황
      </div>

      <Card className="border-none shadow-lg bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6 text-center space-y-6">
          
          {/* ... (이번달 수익 부분은 기존 코드 유지) ... */}
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
          
          {/* ... (누적 수익 부분 기존 코드 유지) ... */}
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

          {/* 👇 [목표 그래프 부분] */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold">
              {/* 목표 이름과 금액 표시 */}
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                🌴 {goalTitle || "목표를 설정해주세요"} ({goalAmount.toLocaleString()}원)
              </span>
              
              {/* 연필 버튼 */}
              <button onClick={onEditGoal} className="text-gray-400 hover:text-blue-500 p-1">
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-blue-600 font-bold">{progressPercent.toFixed(1)}% 달성</p>
              <p className="text-[10px] text-gray-400">
                {(goalAmount - totalAmount) > 0 
                  ? `${(goalAmount - totalAmount).toLocaleString()}원 남음` 
                  : "🎉 목표 달성!"}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}