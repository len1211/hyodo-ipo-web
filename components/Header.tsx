'use client'

import { useState } from 'react' // 👈 1. useState 추가
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
// 👈 2. 로딩 아이콘(Loader2) 추가
import { RefreshCw, LogOut, MessageCircle, UserCircle, Loader2 } from 'lucide-react'
import { storage } from '@/utils/storage'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  // 3. 로그인 로딩 상태 추가
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const handleRefresh = () => {
    storage.remove('ipo_home_data');
    storage.remove('ipo_raw_cache');
    window.location.reload();
  };

  // 4. 로그인 핸들러 함수 추가
  const handleLogin = async () => {
    try {
      setIsLoginLoading(true); // 로딩 시작 (버튼 비활성화)
      // 현재 보고 있는 페이지로 다시 돌아오게 설정
      await signIn('kakao', { callbackUrl: window.location.href }); 
    } catch (error) {
      console.error(error);
      setIsLoginLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 좌측: 로고 및 메뉴 */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold text-gray-900 tracking-tight">
            효도 청약
          </Link>
          <div className="hidden md:flex gap-5 text-sm font-bold">
            <Link 
              href="/" 
              className={pathname === '/' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}
            >
              공모주
            </Link>
            <Link 
              href="/profit" 
              className={pathname === '/profit' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}
            >
              수익 기록장
            </Link>
          </div>
        </div>

        {/* 우측: 기능 버튼 */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            className="text-gray-400 hover:text-blue-600"
            title="새로고침"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>

          {session ? (
            // 로그인 상태
            <div className="flex items-center gap-3 ml-1">
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-[10px] text-gray-400">반갑습니다</p>
                <p className="text-sm font-bold text-gray-800">{session.user?.name}님</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="text-gray-400 hover:text-red-500 text-xs px-2"
              >
                로그아웃
              </Button>
            </div>
          ) : (
            // 비로그인 상태 (수정된 부분 👇)
            <Button 
              onClick={handleLogin} // 핸들러 연결
              disabled={isLoginLoading} // 로딩 중 클릭 방지
              className={`font-bold text-xs px-3 h-8 rounded-lg ml-2 transition-colors ${
                isLoginLoading 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-[#FEE500] text-black hover:bg-[#FEE500]/90"
              }`}
            >
              {isLoginLoading ? (
                // 로딩 중일 때 아이콘
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                // 평소 상태
                <>
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5 fill-black" /> 
                  로그인
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}