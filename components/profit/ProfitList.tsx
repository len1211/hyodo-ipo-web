'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Trash2 } from 'lucide-react'
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
}

export default function ProfitList({ logs, onDelete }: Props) {
  // 1. [수정] State 타입에 '6m' 추가
  const [filter, setFilter] = useState<'all' | '1m' | '3m' | '6m'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = useMemo(() => {
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
      if (filter === '6m') return diffDays <= 180; // 2. [추가] 6개월(180일) 로직 추가
      
      return true;
    });
  }, [logs, filter, searchTerm]);

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between ml-1">
          <div className="flex items-center gap-1 text-blue-600 font-bold border-l-4 border-blue-600 pl-2 text-sm">
            최근 기록 📝
          </div>
          
          <div className="flex gap-2 text-xs overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'all', label: '전체' },
              { key: '1m', label: '1개월' },
              { key: '3m', label: '3개월' },
              { key: '6m', label: '6개월' }, // 3. [추가] 버튼 리스트에 추가
            ].map((btn) => (
              <button
                key={btn.key}
                // 타입 단언(as any)을 유지하거나, 아래처럼 구체적으로 지정해도 됩니다.
                onClick={() => setFilter(btn.key as 'all' | '1m' | '3m' | '6m')}
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
        </div>

        {/* ... (검색창 및 리스트 영역은 기존과 동일) ... */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="종목명을 검색해보세요" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 bg-white border-gray-200 rounded-xl text-base focus:bg-white" 
          />
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-sm">조건에 맞는 기록이 없어요 🗑️</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
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
          ))
        )}
      </div>
    </div>
  )
}