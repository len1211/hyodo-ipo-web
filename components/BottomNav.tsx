'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, Wallet, Menu } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  // 탭 메뉴 정의
  const navItems = [
    { name: '홈', href: '/', icon: Home },
    { name: '공모주', href: '/ipo', icon: TrendingUp }, // 공모주 페이지 경로 확인 필요
    { name: '수익기록', href: '/profit', icon: Wallet },
    { name: '전체', href: '/menu', icon: Menu },
  ]

  return (
    // md:hidden -> PC 화면에서는 하단바 숨김
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 pb-safe z-50 md:hidden">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-blue-100' : ''}`} />
                {/* 활성화 시 빨간 점 표시 (선택사항) */}
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}