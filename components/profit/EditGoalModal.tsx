'use client'

import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore' // 저장 도구
import { db } from '@/app/firebase' // 내 DB 설정
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2 } from 'lucide-react' // 👇 [추가] 쓰레기통 아이콘

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;          
  initialTitle: string;    
  initialAmount: number;   
  // 👇 [추가] 현재까지 번 돈 (이걸 기준으로 0% 시작점을 잡음)
  currentTotalAmount: number; 
}

export default function EditGoalModal({ 
  isOpen, onClose, userId, initialTitle, initialAmount, currentTotalAmount 
}: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달 열릴 때, 기존 값 채워넣기
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || '');
      // 0원일 때는 빈칸으로 보여주는 게 수정하기 편함
      setAmount(initialAmount > 0 ? String(initialAmount) : '');
    }
  }, [isOpen, initialTitle, initialAmount]);

  // [저장] 버튼 눌렀을 때
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 디버깅 로그
    console.log("저장 시도 - UserId:", userId);
    
    if (!userId) {
        alert("로그인 정보(ID)를 불러오지 못했습니다. 다시 로그인해주세요.");
        return;
    } 
    
    setIsSubmitting(true);

    try {
      await setDoc(doc(db, 'users', userId), {
        goalTitle: title,
        goalAmount: Number(amount),
        // 👇 [핵심] 목표를 설정하는 '지금 이 순간'의 총액을 시작점으로 기록함
        // 이렇게 해야 "앞으로 버는 돈"부터 카운트가 됨 (0% 시작)
        goalStartAmount: currentTotalAmount
      }, { merge: true });
      
      onClose(); 
    } catch (error) {
      console.error(error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 [추가] [초기화] 버튼 눌렀을 때
  const handleReset = async () => {
    if (!confirm("정말 목표를 초기화하시겠습니까?")) return;
    if (!userId) return;
    
    setIsSubmitting(true);
    try {
      // 모든 목표 관련 필드를 초기화
      await setDoc(doc(db, 'users', userId), {
        goalTitle: "",
        goalAmount: 0,
        goalStartAmount: 0 
      }, { merge: true });

      onClose();
    } catch (error) {
      alert("초기화 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">🎯 목표 수정하기</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6 mt-2">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">목표 이름</label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="예: 안마의자 사드리기"
                className="text-lg py-6"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">목표 금액</label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="text-right font-bold text-2xl py-6 pr-10 text-blue-600"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">원</span>
              </div>
            </div>
          </div>

          {/* 👇 버튼 영역: [초기화] 와 [수정 완료] 로 나눔 */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              onClick={handleReset}
              variant="outline"
              className="flex-1 h-14 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 font-bold rounded-xl"
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              초기화
            </Button>

            <Button 
              type="submit" 
              className="flex-[2] bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold rounded-xl" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "수정 완료"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}