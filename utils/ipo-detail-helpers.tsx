// utils/ipo-detail-helpers.tsx
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

// 1. 증권사 링크 모음
export const brokersLinks: Record<string, string> = {
    '토스증권': 'https://tossinvest.com',
    '카카오페이증권': 'https://kakaopay.com',
    'KB증권': 'https://m.kbsec.com',
    '미래에셋증권': 'https://securities.miraeasset.com/mobile/index.jsp',
    '삼성증권': 'https://www.samsungpop.com',
    '한국투자증권': 'https://www.truefriend.com/main/main.jsp',
    'NH투자증권': 'https://m.namuh.com',
    '키움증권': 'https://www.kiwoom.com/h/main',
    '신한투자증권': 'https://www.shinhansec.com',
    '하나증권': 'https://www.hanaw.com',
    '대신증권': 'https://www.daishin.com',
    '유안타증권': 'https://www.myasset.com',
    '한화투자증권': 'https://www.hanwhawm.com',
    '신영증권': 'https://www.shinyoung.com',
    '현대차증권': 'https://www.hmsec.com',
    '하이투자증권': 'https://www.hi-ib.com',
    'DB금융투자': 'https://www.db-fi.com',
    'IBK투자증권': 'https://www.ibks.com',
    '유진투자증권': 'https://www.eugenefn.com',
    '교보증권': 'https://www.iprovest.com',
    'LS증권': 'https://www.ls-sec.co.kr',
}

// 2. 신호등 상태별 UI 설정 리턴 함수
export const getStatusConfig = (recommendState: string = "") => {
    // 빨간불 (패스/비추천)
    if (recommendState.includes("패스") || recommendState.includes("비추천") || recommendState.includes("마세요")) {
        return {
            icon: XCircle,
            color: 'text-red-600',
            badgeBg: 'bg-red-100',
            badgeText: 'text-red-800',
            badgeBorder: 'border-red-300',
            statusText: '청약 비추천'
        }
    }
    // 초록불 (추천)
    if (recommendState.includes("추천") || recommendState.includes("강력")) {
        return {
            icon: CheckCircle,
            color: 'text-green-600',
            badgeBg: 'bg-green-100',
            badgeText: 'text-green-800',
            badgeBorder: 'border-green-300',
            statusText: '적극 추천'
        }
    }
    // 노란불 (보통/신중)
    if (recommendState.includes("보통") || recommendState.includes("신중")) {
        return {
            icon: AlertCircle,
            color: 'text-orange-500',
            badgeBg: 'bg-orange-100',
            badgeText: 'text-orange-800',
            badgeBorder: 'border-orange-300',
            statusText: '신중하게'
        }
    }
    // 기본값
    return {
        icon: AlertCircle,
        color: 'text-gray-500',
        badgeBg: 'bg-gray-100',
        badgeText: 'text-gray-800',
        badgeBorder: 'border-gray-300',
        statusText: '아직 모름'
    }
}