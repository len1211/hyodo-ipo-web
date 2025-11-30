'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

// 필요한 데이터 타입 정의
type ProfitLog = {
  date: string; // YYYY-MM-DD
  // 다른 필드는 달력 표시에 필요 없음
}

type Props = {
  logs: ProfitLog[]; // 기록된 날짜를 확인하기 위해 필요
}

export default function ProfitCalendar({ logs }: Props) {
  // 달력의 현재 날짜 상태는 이 컴포넌트 내부에서만 관리합니다.
  // (메인 페이지는 이 달력이 몇 월을 보여주는지 알 필요가 없기 때문입니다)
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- 날짜 이동 핸들러 ---
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // --- 달력 생성 로직 ---
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 이번 달 1일의 요일 (0: 일요일, 1: 월요일 ...)
    const firstDay = new Date(year, month, 1).getDay();
    // 이번 달 마지막 날짜
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // 1일 이전의 빈칸 채우기
    for(let i = 0; i < firstDay; i++) days.push(null);
    // 1일부터 마지막 날까지 숫자 채우기
    for(let i = 1; i <= lastDay; i++) days.push(i);
    
    return days;
  };

  // --- 기록 확인 로직 ---
  const hasRecord = (day: number) => {
    // 비교를 위해 'YYYY-MM-DD' 포맷으로 변환
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const targetDate = `${year}-${month}-${d}`;
    
    return logs.some(log => log.date === targetDate);
  };

  // 오늘 날짜인지 확인
  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-2">
      {/* 섹션 타이틀 */}
      <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm ml-1">
        수익 달력 📅
      </div>

      <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
        {/* 달력 헤더 (년월 이동) */}
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-1">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </h3>
            <div className="flex gap-1">
              <Button 
                variant="outline" size="sm" 
                className="h-8 w-8 p-0 rounded-full border-gray-200" 
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" size="sm" 
                className="h-8 px-3 text-xs rounded-full border-gray-200 font-bold" 
                onClick={handleToday}
              >
                오늘
              </Button>
              <Button 
                variant="outline" size="sm" 
                className="h-8 w-8 p-0 rounded-full border-gray-200" 
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* 달력 그리드 */}
        <CardContent className="px-4 pb-6">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2 font-medium">
            <span className="text-red-400">일</span>
            <span>월</span><span>화</span><span>수</span><span>목</span><span>금</span>
            <span className="text-blue-400">토</span>
          </div>

          {/* 날짜 셀 */}
          <div className="grid grid-cols-7 gap-1 text-sm">
            {generateCalendar().map((day, i) => (
              <div 
                key={i} 
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg relative
                  ${day ? 'hover:bg-gray-50' : ''}
                `}
              >
                {day && (
                  <>
                    <span className={`
                      z-10 w-7 h-7 flex items-center justify-center rounded-full text-sm
                      ${isToday(day) 
                        ? 'bg-gray-900 text-white font-bold shadow-md' // 오늘은 검은색 원
                        : (i % 7 === 0 ? 'text-red-500' : (i % 7 === 6 ? 'text-blue-500' : 'text-gray-700')) // 일/토요일 색상
                      }
                    `}>
                      {day}
                    </span>
                    
                    {/* 수익 기록이 있는 날 빨간 점 표시 */}
                    {hasRecord(day) && (
                      <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 범례 */}
          <div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-400">
             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 수익 기록
             </span>
             <span className="flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-gray-900 rounded-full"></span> 오늘
             </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}