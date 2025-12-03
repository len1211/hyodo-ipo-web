'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Megaphone } from 'lucide-react'

// window 객체에 Kakao가 있다는 것을 타입스크립트에게 알림
declare global {
  interface Window {
    Kakao: any;
  }
}

type Props = {
  userName?: string;
  monthlyAmount: number; // 👈 추가된 Props
}

export default function ProfitHeader({ userName, monthlyAmount }: Props) {

  // 1. 카카오 SDK 초기화
  useEffect(() => {
    // 스크립트가 로드되었는지 확인
    if (window.Kakao) {
      // 중복 초기화 방지
      if (!window.Kakao.isInitialized()) {
        // 👇 여기에 본인의 [JavaScript 키]를 넣으세요!
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '본인의_카카오_자바스크립트_키_입력');
      }
    }
  }, []);

  // 2. 공유하기 핸들러
  const handleShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${userName}님의 수익 인증! 💰`,
        description: `이번 달 공모주로 ${monthlyAmount.toLocaleString()}원 벌었어요! 
치킨 ${Math.floor(monthlyAmount / 20000)}마리 먹을 수 있습니다. 🍗`,
        imageUrl:
          'https://hyodo-care.com/og-image.png', // 썸네일 이미지 URL (본인 앱 로고나 썸네일 URL로 교체 추천)
        link: {
          // mobileWebUrl: window.location.href,
          // webUrl: window.location.href,
          mobileWebUrl: 'https://hyodo-care.com',
          webUrl: 'https://hyodo-care.com',
        },
      },
      buttons: [
        {
          title: '구경하러 가기',
          link: {
            mobileWebUrl: 'https://hyodo-care.com',
            webUrl: 'https://hyodo-care.com',
          },
        },
      ],
    });
  };

  return (
    <div className="flex justify-between items-center py-4 px-1">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          수익 기록장
          <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            효도청약
          </span>
        </h1>
      </div>

      <Button
        onClick={handleShare}
        size="sm"
        className="
          bg-[#FEE500] hover:bg-[#FEE500]/90 
          text-black font-bold text-xs 
          px-4 h-9 rounded-full shadow-md 
          transition-transform active:scale-95
          flex items-center gap-1.5
        "
      >
        <Megaphone className="w-3.5 h-3.5" />
        자랑하기
      </Button>
    </div>
  )
}