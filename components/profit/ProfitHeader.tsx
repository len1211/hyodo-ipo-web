'use client'

import { Button } from '@/components/ui/button'
import { Megaphone, Share2 } from 'lucide-react'

type Props = {
  userName?: string; // 사용자 이름 (선택 사항: "이승환님의 수익 기록장" 처럼 쓸 경우 대비)
  onShareClick?: () => void; // 부모 컴포넌트에서 클릭 이벤트 제어 가능
}

export default function ProfitHeader({ userName, onShareClick }: Props) {
  
  // 기본 공유 핸들러 (부모에서 함수를 안 넘겨줬을 때 작동)
  const handleDefaultShare = async () => {
    // 1. 모바일 네이티브 공유하기 (Navigator Share API)
    if (navigator.share) {
      try {
        await navigator.share({
          title: '효도 청약 수익 인증',
          text: '나 오늘 공모주로 치킨값 벌었다! 🍗 너도 한번 시작해봐.',
          url: window.location.href,
        });
        return;
      } catch (err) {
        console.log('공유 취소됨');
      }
    }
    
    // 2. PC거나 공유 기능 미지원 시: 클립보드 복사 or 알림
    alert("📢 친구들에게 수익을 자랑해보세요! (카카오톡 공유 기능 준비중)");
  };

  return (
    <div className="flex justify-between items-center py-4 px-1">
      {/* 왼쪽: 타이틀 영역 */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          수익 기록장
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            효도청약
          </span>
        </h1>
        {/* 서브 텍스트가 필요하면 주석 해제 */}
        {/* <p className="text-xs text-gray-400 mt-1">티끌 모아 태산! 💰</p> */}
      </div>

      {/* 오른쪽: 자랑하기 버튼 */}
      <Button 
        onClick={onShareClick || handleDefaultShare}
        size="sm" 
        className="
          bg-[#FFD700] hover:bg-[#FFC700] 
          text-black font-bold text-xs 
          px-4 h-9 rounded-full shadow-md 
          transition-transform active:scale-95
          flex items-center gap-1.5
        "
      >
        <Megaphone className="w-3.5 h-3.5" /> {/* 또는 Share2 아이콘 */}
        자랑하기
      </Button>
    </div>
  )
}