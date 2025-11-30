'use client'

import { useState, useMemo, useEffect } from 'react' // useEffect 추가
import { Button } from '@/components/ui/button'
import { Search, Trash2, ChevronDown, X } from 'lucide-react' // 👇 [추가] X 아이콘 임포트
import { Input } from '@/components/ui/input'

type ProfitLog = {
  id: string;
  stockName: string;
  amount: number;
  date: string;
}

type Props = {
  logs: ProfitLog[];
  onDelete: (id: string) => void;
  // 👇 [추가] 부모로부터 받는 Props
  selectedDate: string | null;
  onResetDate: () => void;
}

export default function ProfitList({ logs, onDelete, selectedDate, onResetDate }: Props) {
  const [filter, setFilter] = useState<'all' | '1m' | '3m' | '6m'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 화면에 보여줄 개수 상태 (기본 5개)
  const [visibleCount, setVisibleCount] = useState(5);

  // 👇 [추가] 날짜가 선택되면 '더보기' 상태를 초기화 (UX 향상)
  useEffect(() => {
    setVisibleCount(5);
  }, [selectedDate, filter]);

  const filteredLogs = useMemo(() => {
    // ⭐️ [핵심] 날짜가 선택되어 있다면, 그 날짜 기록만 리턴하고 끝냄!
    if (selectedDate) {
      return logs.filter(log => log.date === selectedDate);
    }

    // 선택된 날짜가 없으면 기존 로직(검색어, 기간필터) 실행
    const now = new Date();

    return logs.filter(log => {
      if (searchTerm && !log.stockName.includes(searchTerm)) {
        return false;
      }

      if (filter === 'all') return true;

      const logDate = new Date(log.date);
      const diffTime = Math.abs(now.getTime() - logDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filter === '1m') return diffDays <= 30;
      if (filter === '3m') return diffDays <= 90;
      if (filter === '6m') return diffDays <= 180;

      return true;
    });
  }, [logs, filter, searchTerm, selectedDate]); // 의존성 배열에 selectedDate 추가

  // 더 보기 버튼 핸들러
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-3">
        {/* 헤더 영역 수정: 날짜가 선택되었을 때와 아닐 때 다르게 표시 */}
        <div className="flex items-center justify-between ml-1">
          
          {selectedDate ? (
            /* [CASE A] 특정 날짜 선택됨 -> '초기화' 버튼 보여주기 */
            <div className="flex items-center gap-2 w-full justify-between">
               <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm">
                  {selectedDate} 기록 📅
               </div>
               <Button 
                 onClick={onResetDate}
                 variant="ghost" 
                 size="sm" 
                 className="h-7 px-3 text-xs text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full border border-gray-200"
               >
                 <X className="w-3 h-3 mr-1" /> 전체 보기
               </Button>
            </div>
          ) : (
            /* [CASE B] 평소 상태 -> 기존 필터 버튼 보여주기 */
            <>
              <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm">
                최근 기록 📝
              </div>

              <div className="flex gap-2 text-xs overflow-x-auto pb-1 no-scrollbar">
                {[
                  { key: 'all', label: '전체' },
                  { key: '1m', label: '1개월' },
                  { key: '3m', label: '3개월' },
                  { key: '6m', label: '6개월' },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key as any)}
                    className={`
                      px-3 py-1.5 rounded-full transition-colors whitespace-nowrap font-medium
                      ${filter === btn.key
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 검색창 (날짜 선택 안됐을 때만 보여줌 - 선택적) */}
        {!selectedDate && (
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="종목명을 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 bg-white border-gray-200 rounded-xl text-base focus:bg-white"
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-sm">
              {selectedDate ? "이 날짜엔 기록이 없어요 텅~ 🗑️" : "조건에 맞는 기록이 없어요 🗑️"}
            </p>
          </div>
        ) : (
          <>
            {/* 더 보기 기능 적용 */}
            {filteredLogs.slice(0, visibleCount).map((log) => (
              <div
                key={log.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center active:bg-gray-50 transition-colors"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xs shadow-inner">
                    수익
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg leading-tight mb-0.5">
                      {log.stockName}
                    </p>
                    <p className="text-xs text-gray-400">{log.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-red-500 font-bold text-lg">
                    +{log.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => onDelete(log.id)}
                    className="text-xs text-gray-300 underline mt-1 p-2 hover:text-red-500 transition-colors flex items-center justify-end gap-1 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" /> 삭제
                  </button>
                </div>
              </div>
            ))}

            {/* 더 보여줄 데이터가 남았을 때만 '더 보기' 버튼 표시 */}
            {visibleCount < filteredLogs.length && (
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                className="w-full rounded-xl py-6 text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900 bg-white"
              >
                <ChevronDown className="w-4 h-4 mr-1" /> 
                더 보기 ({filteredLogs.length - visibleCount}개 남음)
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}