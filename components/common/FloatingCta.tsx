'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FloatingCta() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  // 1. 특정 페이지에서만 보이게 설정 (상세 페이지 등)
  // 예: 공모주 상세 정보를 보고 있을 때만 띄움
  const isDetailPage = pathname?.includes('/ipo/'); // URL 규칙에 맞게 수정 필요
  const isHiddenPage = ['/profit', '/login'].some(p => pathname?.startsWith(p));

  useEffect(() => {
    // 페이지 진입 1.5초 후 스르륵 나타나게 (시선 강탈 효과)
    if (!isHiddenPage) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname, isHiddenPage]);

  if (isHiddenPage) return null;

  return (
    // bottom-20 : 하단 탭바 높이만큼 위로 띄움 (탭바 높이에 따라 숫자 조절: 16~24)
    <div 
      className={`fixed bottom-20 left-1/2 z-50 w-[90%] -translate-x-1/2 transform transition-all duration-500 ease-out md:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between rounded-full bg-gray-900/90 px-5 py-3 text-white shadow-xl backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-xs text-yellow-300">💰 잊지 말고 챙기세요</span>
          <span className="text-sm font-bold">내 공모주 수익 기록하기</span>
        </div>
        
        <Link 
          href="/profit" 
          className="ml-3 shrink-0 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition active:scale-95">
          이동 
        </Link>
        
        {/* 닫기 버튼 (UX 배려) */}
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}