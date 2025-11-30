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

import EditGoalModal from '@/components/profit/EditGoalModal' // 👈 임포트

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

  

  // --- 상태 관리 ---
  const [logs, setLogs] = useState<ProfitLog[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [monthlyAmount, setMonthlyAmount] = useState(0)

  // 1. 목표 데이터 관리 State
  const [goalTitle, setGoalTitle] = useState('제주도 효도 여행');
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false); 
  
  // 2. 수익 데이터 실시간 조회 (기존 코드)
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

  // 👇 [추가된 부분] 3. 목표 데이터 실시간 조회 (이게 없었습니다!)
  useEffect(() => {
    if (userId) {
      const userRef = doc(db, 'users', userId);
      
      // 내 정보(users/내ID)가 바뀌면 즉시 실행됨 (목표 수정 시 바로 반영)
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // 데이터가 있으면 state 업데이트
          if (data.goalTitle) setGoalTitle(data.goalTitle);
          if (data.goalAmount) setGoalAmount(Number(data.goalAmount));
        }
      });
      return () => unsubscribe();
    }
  }, [userId]);
  // -------------------------------------------------------


  // 4. 삭제 핸들러
  const handleDelete = async (logId: string) => {
    if (!confirm("정말 이 기록을 삭제하시겠습니까?")) return;
    try { 
      await deleteDoc(doc(db, 'users', userId, 'profits', logId)); 
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // --- 비로그인 화면 ---
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

  // --- 메인 화면 ---
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 컨테이너 */}
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pt-2 space-y-4">
        
        {/* 1. 헤더 */}
        <ProfitHeader userName={session?.user?.name || '사용자'} />

        {/* 2. 자산 현황 카드 (데이터 전달) */}
        <AssetCard 
          monthlyAmount={monthlyAmount} 
          totalAmount={totalAmount}
          goalTitle={goalTitle}     
          goalAmount={goalAmount}   
          onEditGoal={() => setIsEditGoalOpen(true)} 
        />

        {/* 3. 랭킹 카드 */}
        <RankingCard logs={logs} />

        {/* 4. 달력 */}
        <ProfitCalendar logs={logs} />

        {/* 5. 기록하기 버튼 */}
        <AddProfitModal userId={userId} />

        {/* 6. 기록 리스트 */}
        <ProfitList 
          logs={logs} 
          onDelete={handleDelete} 
        />

        {/* 목표 수정 모달 (숨겨져 있음) */}
        <EditGoalModal 
          isOpen={isEditGoalOpen}
          onClose={() => setIsEditGoalOpen(false)}
          userId={userId}
          initialTitle={goalTitle}
          initialAmount={goalAmount}
        />

      </div>
    </div>
  );
}