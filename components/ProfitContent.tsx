'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import ProfitHeader from '@/components/profit/ProfitHeader'
import AssetCard from '@/components/profit/AssetCard'
import RankingCard from '@/components/profit/RankingCard'
import ProfitCalendar from '@/components/profit/ProfitCalendar'
import AddProfitModal from '@/components/profit/AddProfitModal'
import ProfitList from '@/components/profit/ProfitList'
import EditGoalModal from '@/components/profit/EditGoalModal'

type ProfitLog = {
  id: string;
  stockName: string;
  amount: number;
  date: string;
  createdAt: number;
}

export default function ProfitContent() {
  const { data: session } = useSession()
  const userId = (session?.user as any)?.id || session?.user?.email;

  // --- 상태 관리 ---
  const [logs, setLogs] = useState<ProfitLog[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [monthlyAmount, setMonthlyAmount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 1. 목표 데이터 관리 State
  const [goalTitle, setGoalTitle] = useState(''); // 제목도 기본값 빈칸으로
  const [goalAmount, setGoalAmount] = useState(0); // 👈 [수정 1] 기본값 0원으로 변경
  const [goalStartAmount, setGoalStartAmount] = useState(0); 
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false); 
  
  // 2. 수익 데이터 실시간 조회
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

  // 3. 목표 데이터 실시간 조회
  useEffect(() => {
    if (userId) {
      const userRef = doc(db, 'users', userId);
      
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // 👇 [수정 2] 값이 있으면(0 포함) 업데이트
          if (data.goalTitle !== undefined) setGoalTitle(data.goalTitle);
          if (data.goalAmount !== undefined) setGoalAmount(Number(data.goalAmount));
          if (data.goalStartAmount !== undefined) setGoalStartAmount(Number(data.goalStartAmount));
        }
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const handleDelete = async (logId: string) => {
    if (!confirm("정말 이 기록을 삭제하시겠습니까?")) return;
    try { 
      await deleteDoc(doc(db, 'users', userId, 'profits', logId)); 
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pt-2 space-y-4">
        
        <ProfitHeader userName={session?.user?.name || '사용자'} />

        <AssetCard 
          monthlyAmount={monthlyAmount} 
          totalAmount={totalAmount}
          goalTitle={goalTitle}     
          goalAmount={goalAmount}
          goalStartAmount={goalStartAmount}
          onEditGoal={() => setIsEditGoalOpen(true)} 
        />

        <RankingCard logs={logs} />
        
        <ProfitCalendar 
          logs={logs} 
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <AddProfitModal userId={userId} />

        <ProfitList 
          logs={logs} 
          onDelete={handleDelete}
          selectedDate={selectedDate}
          onResetDate={() => setSelectedDate(null)}
        />

        <EditGoalModal 
          isOpen={isEditGoalOpen}
          onClose={() => setIsEditGoalOpen(false)}
          userId={userId}
          initialTitle={goalTitle}
          initialAmount={goalAmount}
          currentTotalAmount={totalAmount}
        />

      </div>
    </div>
  );
}