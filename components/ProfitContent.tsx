'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/app/firebase'
// Loader2 아이콘은 없으면 빼셔도 되지만, 로딩 표시에 좋습니다. (lucide-react에 기본 포함)
import { MessageCircle, TrendingUp, Calendar, Trophy, Loader2 } from 'lucide-react'
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
  const [goalTitle, setGoalTitle] = useState(''); 
  const [goalAmount, setGoalAmount] = useState(0);
  const [goalStartAmount, setGoalStartAmount] = useState(0); 
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false); 
  
  // ⭐ [수정 1] 로그인 로딩 상태 추가
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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

  // ⭐ [수정 2] 로그인 핸들러 함수 추가
  // 버튼 클릭 시 즉시 로딩 상태로 만들고, callbackUrl을 명시합니다.
  const handleKakaoLogin = async () => {
    try {
      setIsLoginLoading(true); // 로딩 시작 (버튼 비활성화)
      await signIn('kakao', { callbackUrl: window.location.href }); 
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoginLoading(false); // 실패 시 로딩 해제
    }
  };

  // 비로그인(봇/게스트)에게 보여줄 '소개 화면'
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          
          {/* 1. 헤더 영역 */}
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            나만의 공모주 수익 기록장
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            흩어져 있는 수익 내역, 이제 한곳에서 관리하세요.
          </p>

          {/* 2. 기능 소개 */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">수익률 자동 계산</h3>
                <p className="text-xs text-gray-500">매도 금액만 입력하면 월별/누적 수익을 자동으로 계산해 드립니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">캘린더 뷰 제공</h3>
                <p className="text-xs text-gray-500">언제 어떤 종목으로 수익을 냈는지 달력 형태로 한눈에 확인하세요.</p>
              </div>
            </div>
          </div>

          {/* 3. 로그인 버튼 (CTA) - ⭐ [수정 3] 로딩 상태 적용 */}
          <Button 
            onClick={handleKakaoLogin} 
            disabled={isLoginLoading} // 로딩 중 클릭 방지
            className={`w-full font-bold py-6 px-4 text-base rounded-xl shadow-md transition-all active:scale-95 ${
                isLoginLoading 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" // 로딩 중 스타일
                  : "bg-[#FEE500] text-black hover:bg-[#FEE500]/90" // 평소 스타일
            }`}
          >
            {isLoginLoading ? (
                // 로딩 중일 때 보여줄 UI
                <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>카카오로 이동 중...</span>
                </div>
            ) : (
                // 평소 UI
                <>
                    <MessageCircle className="w-5 h-5 mr-2" /> 
                    카카오로 3초 만에 시작하기
                </>
            )}
          </Button>
          
          <p className="mt-4 text-xs text-gray-400">
            로그인하면 즉시 무료로 사용할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pt-2 space-y-4">
        
        <ProfitHeader userName={
          session?.user?.name || '사용자'}
          monthlyAmount={monthlyAmount}
          />

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