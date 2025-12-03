import MenuContent from '@/components/MenuContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '전체 메뉴 - 효도 청약',
  description: '서비스 설정 및 전체 메뉴를 확인하세요.',
}

export default function MenuPage() {
  return <MenuContent />
}