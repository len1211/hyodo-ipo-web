'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  ChevronRight, 
  LogOut, 
  LogIn, 
  Calendar, 
  Wallet, 
  BookOpen, 
  MessageCircle, 
  ShieldCheck, 
  HelpCircle,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function MenuContent() {
  const { data: session } = useSession()
  const router = useRouter()

  // 메뉴 아이템 렌더링 헬퍼 컴포넌트
  const MenuItem = ({ icon: Icon, label, href, onClick, badge }: any) => (
    <div 
      onClick={onClick ? onClick : () => router.push(href)}
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium text-gray-700 text-sm sm:text-base">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <Badge variant="secondary" className="text-xs bg-red-100 text-red-600 hover:bg-red-100 border-none">
            {badge}
          </Badge>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        
        {/* 1. 상단 헤더 */}
        <header className="bg-white p-4 sm:p-6 pb-2 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">전체 메뉴</h1>
        </header>

        <div className="p-4 sm:p-6 space-y-6">

          {/* 2. 프로필 카드 */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full text-white backdrop-blur-sm">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1 text-white">
                  {session ? (
                    <>
                      <h2 className="text-lg font-bold">{session.user?.name || '사용자'}님</h2>
                      <p className="text-blue-100 text-sm">{session.user?.email}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-bold">로그인이 필요해요</h2>
                      <p className="text-blue-100 text-sm">3초만에 시작하기</p>
                    </>
                  )}
                </div>
                <div>
                  {session ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => signOut()}
                      className="text-white hover:bg-white/20 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      로그아웃
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => signIn()}
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      로그인
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 서비스 바로가기 그룹 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2 px-1">서비스</h3>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <MenuItem icon={Calendar} label="전체 청약 일정" href="/ipo" />
              <MenuItem icon={Wallet} label="나의 수익 기록장" href="/profit" badge="New" />
              <MenuItem icon={BookOpen} label="공모주 가이드" href="/guide" />
            </div>
          </div>

          {/* 4. 고객지원 그룹 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2 px-1">고객지원</h3>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <MenuItem icon={MessageCircle} label="카카오톡 문의하기 (준비 중입니다.)" onClick={() => alert('준비 중입니다.')} />
              <MenuItem icon={HelpCircle} label="자주 묻는 질문 (준비 중입니다.)" href="#" />
              <MenuItem icon={Bell} label="공지사항 (준비 중입니다.)" href="#" />
            </div>
          </div>

          {/* 5. 앱 설정 그룹 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2 px-1">설정</h3>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <MenuItem icon={ShieldCheck} label="개인정보 처리방침" href="/privacy" />
              <MenuItem icon={Settings} label="앱 설정" href="#" />
              
              {/* 버전 정보 */}
              <div className="flex items-center justify-between p-4 bg-white border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700 text-sm sm:text-base">현재 버전</span>
                </div>
                <span className="text-gray-400 text-sm">v1.0.0</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}