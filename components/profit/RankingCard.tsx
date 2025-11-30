'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, TrendingUp, Medal } from 'lucide-react'

type ProfitLog = {
  id: string;
  stockName: string;
  amount: number;
  date: string;
}

type Props = {
  logs: ProfitLog[]; // 전체 기록 데이터를 받아서 내부에서 계산
}

export default function RankingCard({ logs }: Props) {
  
  // [로직] 종목별 수익금 합계 계산 및 정렬
  const ranking = useMemo(() => {
    const summary: { [key: string]: number } = {};
    
    // 1. 종목별 합산
    logs.forEach(log => {
      if (summary[log.stockName]) {
        summary[log.stockName] += Number(log.amount);
      } else {
        summary[log.stockName] = Number(log.amount);
      }
    });

    // 2. 배열로 변환 후 내림차순 정렬 (수익 높은 순)
    return Object.entries(summary)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3); // 상위 3개만 자르기
  }, [logs]);

  return (
    <div className="space-y-2">
      {/* 타이틀 */}
      <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm ml-1">
        나만의 효도 종목 랭킹 🏆
      </div>

      <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
        {ranking.length === 0 ? (
          /* --- [CASE A] 데이터가 없을 때 (Placeholder) --- */
          <CardContent className="py-10 px-6 text-center text-gray-400">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-bold text-gray-500 mb-1 text-sm">아직 데이터가 부족해요!</p>
            <p className="text-xs leading-relaxed">
              수익을 기록하면<br/>
              어떤 주식이 <span className="text-blue-600 font-bold">진짜 효자 종목</span>인지<br/>
              알려드릴게요.
            </p>
          </CardContent>
        ) : (
          /* --- [CASE B] 랭킹 데이터가 있을 때 --- */
          <CardContent className="p-0">
            {ranking.map((item, index) => (
              <div 
                key={item.name} 
                className={`
                  flex items-center justify-between p-5 border-b border-gray-100 last:border-none
                  ${index === 0 ? 'bg-yellow-50/50' : ''} 
                `}
              >
                <div className="flex items-center gap-4">
                  {/* 순위 뱃지 */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm
                    ${index === 0 ? 'bg-[#FFD700] text-white ring-2 ring-[#FFD700]/30' : ''}
                    ${index === 1 ? 'bg-gray-300 text-white' : ''}
                    ${index === 2 ? 'bg-orange-300 text-white' : ''}
                  `}>
                    {index + 1}
                  </div>
                  
                  {/* 종목명 */}
                  <div>
                    <p className="font-bold text-gray-800 flex items-center gap-1">
                      {item.name}
                      {index === 0 && <span className="text-[10px] text-red-500 bg-red-100 px-1.5 rounded-sm">Best</span>}
                    </p>
                    {/* 1등일 때만 멘트 추가 */}
                    {index === 0 && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        가장 많은 치킨을 사줬어요! 🍗
                      </p>
                    )}
                  </div>
                </div>

                {/* 수익금 */}
                <div className="text-right">
                  <p className="font-bold text-red-500">+{item.total.toLocaleString()}원</p>
                  <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                    <TrendingUp className="w-3 h-3" /> 누적 수익
                  </p>
                </div>
              </div>
            ))}
            
            {/* 3개 미만일 때 안내 메시지 */}
            {ranking.length < 3 && ranking.length > 0 && (
               <div className="p-4 text-center bg-gray-50 text-xs text-gray-400">
                  <p>기록이 더 쌓이면 3위까지 보여드려요!</p>
               </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}