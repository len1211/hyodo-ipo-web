import { Metadata } from 'next'
import IpoListSection from '@/components/ipo/IpoListSection'

export const metadata: Metadata = {
  title: '전체 청약 일정 - 효도 청약',
  description: '진행 중인 청약과 예정된 청약 일정을 모두 확인하세요.',
}

export default function IpoPage() {
  return (
    // 👇 1. 배경색(bg-gray-50)과 최소 높이 설정
    <div className="min-h-screen bg-gray-50">
      
      {/* 👇 2. 중앙 정렬 및 안쪽 여백(padding) 추가 */}
      {/* p-4(모바일) sm:p-6(태블릿) md:p-8(PC) 로 여백을 줍니다 */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        
        {/* 👇 3. 페이지 제목을 추가해서 상단 여백을 자연스럽게 확보 (선택사항) */}
        <h1 className="text-2xl font-bold mb-8 text-gray-900">
            전체 청약 일정
        </h1>

        <IpoListSection />
      </div>
    </div>
  )
}