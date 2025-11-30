'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { RefreshCw, LogOut, MessageCircle, UserCircle } from 'lucide-react'
import { storage } from '@/utils/storage'



export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleRefresh = () => {
    storage.remove('ipo_home_data');
    storage.remove('ipo_raw_cache');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 좌측: 로고 및 메뉴 */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-extrabold text-gray-900 tracking-tight">
            효도 청약
          </Link>
          {/* PC용 메뉴 (모바일에서는 숨김 처리 가능하지만 일단 유지) */}
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
          {/* 새로고침 */}
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
            // 비로그인 상태
            <Button 
              onClick={() => signIn('kakao')}
              className="bg-[#FEE500] text-black hover:bg-[#FEE500]/90 font-bold text-xs px-3 h-8 rounded-lg ml-2"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5 fill-black" /> 
              로그인
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}