'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { useEffect } from 'react'

interface ShareButtonProps {
  title: string
  description: string
  url: string
}

export function ShareButton({ title, description, url }: ShareButtonProps) {
  useEffect(() => {
    // 카카오 SDK 초기화
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('YOUR_JAVASCRIPT_KEY') // 실제 사용시 카카오 개발자 콘솔에서 발급받은 JavaScript 키로 교체
    }
  }, [])

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: 'https://via.placeholder.com/800x400?text=호도+청약+추천',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      })
    } else {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.')
    }
  }

  return (
    <Button
      onClick={handleKakaoShare}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
      size="lg"
    >
      <Share2 className="mr-2 h-5 w-5" />
      카카오톡 공유하기
    </Button>
  )
}

declare global {
  interface Window {
    Kakao: any
  }
}
