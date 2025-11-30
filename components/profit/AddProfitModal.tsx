'use client'

import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'

type Props = {
  userId: string; // 저장을 위해 유저 ID가 꼭 필요함
  onSuccess?: () => void; // 저장 성공 후 부모 컴포넌트에서 할 일(선택)
}

export default function AddProfitModal({ userId, onSuccess }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // 폼 상태 관리
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // 기본값: 오늘
  const [stockName, setStockName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 저장 핸들러
  const handleAddProfit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 금액 유효성 검사
    if (!amount || Number(amount) <= 0) {
      alert("수익금을 입력해주세요!");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'users', userId, 'profits'), {
        stockName, 
        amount: Number(amount), 
        date, 
        createdAt: Date.now()
      });

      // 성공 처리
      setStockName('');
      setAmount('');
      setIsDialogOpen(false); // 모달 닫기
      
      // 부모에게 알림 (토스트 메시지 등을 띄우고 싶을 때 사용)
      if (onSuccess) onSuccess();
      else alert(`🎉 저장 완료! 부자되세요!`);

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* 1. 트리거 버튼 (화면에 항상 떠있는 큰 버튼) */}
      <DialogTrigger asChild>
        <Button 
          className="
            w-full bg-blue-600 hover:bg-blue-700 
            text-white font-bold text-xl 
            py-8 rounded-2xl shadow-lg 
            transition-all active:scale-95
            flex items-center justify-center gap-2
          "
        >
          <Plus className="w-7 h-7" /> 
          오늘 수익 기록하기
        </Button>
      </DialogTrigger>

      {/* 2. 모달 내용 */}
      <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">📝 수익 기록하기</DialogTitle>
          <DialogDescription>
            오늘 번 수익을 기록하고 치킨 지수를 올려보세요!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddProfit} className="space-y-6">
          <div className="space-y-4">
            {/* 날짜 입력 */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">날짜</label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                className="text-lg py-6 bg-gray-50 border-gray-200 focus:bg-white transition-colors" 
              />
            </div>

            {/* 종목명 입력 */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">종목명</label>
              <Input 
                type="text" 
                placeholder="예: 삼성전자, LG에너지솔루션" 
                value={stockName} 
                onChange={(e) => setStockName(e.target.value)} 
                required 
                className="text-lg py-6 bg-gray-50 border-gray-200 focus:bg-white placeholder:text-gray-300" 
              />
            </div>

            {/* 수익금 입력 (가장 중요) */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block ml-1">수익금 (원)</label>
              <div className="relative">
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="
                    text-right font-bold text-2xl py-6 pr-12
                    text-blue-600 bg-blue-50/50 border-blue-100 
                    focus:border-blue-300 focus:ring-blue-100
                  " 
                  required 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  원
                </span>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장 완료"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}