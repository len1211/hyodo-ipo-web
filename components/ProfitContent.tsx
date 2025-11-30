'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 👇 분리한 컴포넌트들 임포트
import ProfitHeader from '@/components/profit/ProfitHeader'
import AssetCard from '@/components/profit/AssetCard'
import RankingCard from '@/components/profit/RankingCard'
import ProfitCalendar from '@/components/profit/ProfitCalendar'
import AddProfitModal from '@/components/profit/AddProfitModal'
import ProfitList from '@/components/profit/ProfitList'

type ProfitLog = {
  id: string;
  stockName: string;
  amount: number;
  date: string;
  createdAt: number;
}

export default function ProfitContent() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id;

  // --- 상태 관리 (데이터만 관리함) ---
  const [logs, setLogs] = useState<ProfitLog[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [monthlyAmount, setMonthlyAmount] = useState(0)
  
  // 1. 데이터 실시간 조회 (사령탑 역할: 데이터를 가져와서 뿌려줌)
  useEffect(() => {
    if (userId) {
      const profitsRef = collection(db, 'users', userId, 'profits');
      const q = query(profitsRef, orderBy('date', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newLogs: ProfitLog[] = [];
        let total = 0;
        let monthly = 0;
        
        const thisYear = new Date().getFullYear();
        const thisMonth = new Date().getMonth() + 1;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const log = { id: doc.id, ...data } as ProfitLog;
          newLogs.push(log);
          
          // 금액 합산 로직
          total += Number(data.amount);
          
          const logDate = new Date(log.date);
          if (logDate.getFullYear() === thisYear && (logDate.getMonth() + 1) === thisMonth) {
            monthly += Number(data.amount);
          }
        });

        setLogs(newLogs);
        setTotalAmount(total);
        setMonthlyAmount(monthly);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  // 2. 삭제 핸들러 (리스트 컴포넌트에 내려줄 함수)
  const handleDelete = async (logId: string) => {
    if (!confirm("정말 이 기록을 삭제하시겠습니까?")) return;
    try { 
      await deleteDoc(doc(db, 'users', userId, 'profits', logId)); 
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // --- 비로그인 화면 (변경 없음) ---
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <Button onClick={() => signIn('kakao')} className="bg-[#FEE500] text-black hover:bg-[#FEE500]/90 font-bold py-6 px-8 text-lg rounded-xl shadow-md">
            <MessageCircle className="w-5 h-5 mr-2" /> 카카오 로그인
          </Button>
        </div>
      </div>
    );
  }

  // --- 메인 화면 (컴포넌트 조립) ---
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 컨테이너: 모바일 꽉 채우기 + 최대 너비 제한 */}
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pt-2 space-y-4">
        
        {/* 1. 헤더 */}
        <ProfitHeader userName={session?.user?.name || '사용자'} />

        {/* 2. 자산 현황 카드 */}
        <AssetCard 
          monthlyAmount={monthlyAmount} 
          totalAmount={totalAmount} 
        />

        {/* 3. 랭킹 카드 */}
        <RankingCard logs={logs} />

        {/* 4. 달력 */}
        <ProfitCalendar logs={logs} />

        {/* 5. 기록하기 버튼 (모달) */}
        <AddProfitModal userId={userId} />

        {/* 6. 기록 리스트 (삭제 함수 전달) */}
        <ProfitList 
          logs={logs} 
          onDelete={handleDelete} 
        />

      </div>
    </div>
  );
}