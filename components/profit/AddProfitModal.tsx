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
import { Plus, Loader2, CheckCircle2 } from 'lucide-react' // 체크 아이콘 추가
import { RECENT_IPO_STOCKS } from '@/constants/stocks';
import KakaoShareButton from '@/components/common/KakaoShareButton'; // 공유 버튼 임포트

type Props = {
  userId: string;
  onSuccess?: () => void;
}

export default function AddProfitModal({ userId, onSuccess }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // ✅ 성공 상태 추가

  // 폼 상태 관리
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stockName, setStockName] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달 닫을 때 초기화 핸들러
  const handleClose = () => {
    setIsDialogOpen(false);
    // 애니메이션이 끝난 후 상태 초기화 (약간의 지연)
    setTimeout(() => {
      setIsSuccess(false);
      setStockName('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    }, 300);
  };

  // 저장 핸들러
  const handleAddProfit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

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

      // ✅ 성공 처리: 바로 닫지 않고 성공 화면으로 전환
      setIsSuccess(true);
      
      // 부모 컴포넌트 데이터 갱신 요청
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      if (!open) handleClose(); // 모달 밖 클릭 등으로 닫힐 때 초기화
      else setIsDialogOpen(true);
    }}>
      {/* 1. 트리거 버튼 */}
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
        
        {/* ✅ 조건부 렌더링: 성공 시 '공유 화면', 아니면 '입력 폼' */}
        {isSuccess ? (
          // [성공 화면]
          <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">기록 완료! 🎉</h2>
            <p className="text-center text-gray-500 mb-6">
              <span className="font-bold text-blue-600">{stockName}</span> 수익이 저장되었습니다.<br/>
              가족들에게 자랑해보세요!
            </p>

            {/* 카카오 공유 버튼 */}
            <div className="w-full">
              <KakaoShareButton 
                stockName={stockName} 
                profit={Number(amount)} 
              />
            </div>

            {/* 닫기 버튼 */}
            <Button 
              onClick={handleClose} 
              variant="ghost" 
              className="mt-4 w-full text-gray-400 hover:text-gray-600"
            >
              닫기
            </Button>
          </div>
        ) : (
          // [입력 폼 화면] - 기존 코드 유지
          <>
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
                    placeholder="예: 더본코리아, 교보스팩19호"
                    value={stockName}
                    onChange={(e) => setStockName(e.target.value)}
                    required
                    className="text-lg py-6 bg-gray-50 border-gray-200 focus:bg-white placeholder:text-gray-300"
                  />
                </div>

                {/* 칩 배치 */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {RECENT_IPO_STOCKS.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setStockName(name)}
                      className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    >
                      {name}
                    </button>
                  ))}
                </div>

                {/* 수익금 입력 */}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}