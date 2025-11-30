'use client'

import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore' // 저장 도구
import { db } from '@/app/firebase' // 내 DB 설정
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;          // 누구의 목표를 수정할지 알아야 함
  initialTitle: string;    // 기존 제목 (예: 제주도 여행)
  initialAmount: number;   // 기존 금액
}

export default function EditGoalModal({ isOpen, onClose, userId, initialTitle, initialAmount }: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달 열릴 때, 기존 값 채워넣기
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || '');
      setAmount(String(initialAmount || 0));
    }
  }, [isOpen, initialTitle, initialAmount]);

  // 저장 버튼 눌렀을 때
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("저장 시도 - UserId:", userId);
    if (!userId) {
        alert("로그인 정보(ID)를 불러오지 못했습니다. 다시 로그인해주세요.");
        return;
    } 
    setIsSubmitting(true);

    try {
      // Firebase 'users' 컬렉션의 내 문서(userId)에 목표 정보 저장(덮어쓰기)
      // { merge: true } 옵션은 기존 닉네임 등을 지우지 않고 목표만 업데이트함
      await setDoc(doc(db, 'users', userId), {
        goalTitle: title,
        goalAmount: Number(amount)
      }, { merge: true });
      
      onClose(); // 성공하면 창 닫기
    } catch (error) {
      console.error(error);
      alert("저장에 실패했습니다.");
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

          <Button type="submit" className="w-full bg-blue-600 h-14 text-lg font-bold rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : "수정 완료"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}