'use client'

import { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Building, Calendar, TrendingUp, FileText, ExternalLink } from 'lucide-react'

// ♻️ 분리한 파일들 import
import { brokersLinks, getStatusConfig } from '@/utils/ipo-detail-helpers'
// ⭐ [수정 1] 아까 만든 타입 가져오기
import { FirebaseIPO } from '@/types/ipo'

// ⭐ [수정 2] props에서 'any' 대신 'FirebaseIPO' 사용
export default function IPODetailContent({ id, initialData }: { id: string, initialData: FirebaseIPO }) {
    
    // ✅ props로 받은 데이터 바로 사용
    const data = initialData;

    // 데이터 없을 때 처리
    if (!data) {
        return <div className="p-10 text-center">데이터가 없습니다.</div>
    }
    
    // 카카오 SDK 로드 상태
    const [kakaoSdkLoaded, setKakaoSdkLoaded] = useState(false);

    // 3. UI 설정값 가져오기 (헬퍼 함수 사용)
    const statusConfig = getStatusConfig(data.recommendState);
    const StatusIcon = statusConfig.icon;
    const underwriters = data.underwriter ? data.underwriter.split(',').map(s => s.trim()) : ['정보 없음'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"
                integrity="sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG0bjM55XohjjDT7tDDC01"
                crossOrigin="anonymous"
                onLoad={() => setKakaoSdkLoaded(true)}
            />

            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                {/* 헤더 */}
                <div className="mb-4 sm:mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="mb-4 hover:bg-gray-100">
                            ← 뒤로
                        </Button>
                    </Link>
                    <h1 className="text-xl sm:text-2xl font-bold">{data.stockName}</h1>
                </div>

                {/* 핵심 분석 카드 (신호등) */}
                <Card className="mb-4 sm:mb-6 border-2">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-center text-center gap-3">
                            <StatusIcon className={`h-12 sm:h-16 w-12 sm:w-16 ${statusConfig.color}`} strokeWidth={2.5} />
                            <Badge className={`${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeBorder} text-sm sm:text-base font-semibold px-3 sm:px-4 py-1 sm:py-1.5`}>
                                {statusConfig.statusText}
                            </Badge>
                            <div className="mt-2">
                                <p className="text-sm font-semibold text-gray-800 mb-2">
                                    {statusConfig.statusText === '적극 추천' ? '이러한 이유로 추천합니다' :
                                     statusConfig.statusText === '신중하게' ? '이러한 이유로 신중하게 판단하세요' :
                                     statusConfig.statusText === '청약 비추천' ? '이러한 이유로 추천하지 않습니다' :
                                     '아래 정보를 확인하세요'}
                                </p>
                                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                                    {data.reason || `기관 경쟁률 ${data.competitionRate || '미정'}. ${data.underwriter || ''} 주관.`}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 기업 정보 */}
                <Card className="mb-4 sm:mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <h2 className="text-lg sm:text-xl font-bold">기업 정보</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">회사명</span>
                                <span className="font-semibold text-sm sm:text-base text-right">{data.stockName}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">업종</span>
                                <span className="font-semibold text-sm sm:text-base text-right">{data.category || '정보 없음'}</span>
                            </div>
                            <div className="flex justify-between py-2 gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">주관사</span>
                                <span className="font-semibold text-sm sm:text-base text-right">{data.underwriter}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 청약 일정 */}
                <Card className="mb-4 sm:mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <h2 className="text-lg sm:text-xl font-bold">청약 일정</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">청약 기간</span>
                                <span className="font-semibold text-sm sm:text-base text-right">{data.schedule}</span>
                            </div>
                            <div className="flex justify-between py-2 gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">상장 예정일</span>
                                <span className="font-semibold text-sm sm:text-base text-right">{data.listingDate || '미정'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 주요 지표 */}
                <Card className="mb-4 sm:mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <h2 className="text-lg sm:text-xl font-bold">주요 지표</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">공모가</span>
                                <span className="font-bold text-base sm:text-lg text-blue-600">{data.price}원</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">기관 경쟁률</span>
                                <span className="font-bold text-base sm:text-lg text-blue-600">{data.competitionRate}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">일반 경쟁률</span>
                                <span className="font-bold text-base sm:text-lg">{data.retailCompetition || '정보 없음'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">의무보유 확약률</span>
                                <span className="font-bold text-base sm:text-lg">{data.lockupRate || '정보 없음'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 gap-4">
                                <span className="text-gray-600 text-sm sm:text-base">최소 증거금</span>
                                <span className="font-bold text-base sm:text-lg text-green-600">{data.minDeposit}원</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 참여 증권사 (CPA 버튼) */}
                <Card className="mb-4 sm:mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <h2 className="text-lg sm:text-xl font-bold">참여 증권사</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {underwriters.map((underwriter: string, index: number) => (
                                <div key={index} className="bg-white border-2 border-gray-300 rounded-lg p-3 sm:p-4 flex items-center justify-between hover:border-blue-400 transition-colors">
                                    <span className="font-semibold text-sm sm:text-base">{underwriter}</span>
                                    <Link
                                        // ⭐ [수정 3] 빨간줄 핵심 원인 해결!
                                        // brokersLinks 객체에 underwriter라는 키가 있는지 확실치 않아 생기는 에러를 방지합니다.
                                        href={(brokersLinks as any)[underwriter] || `https://www.google.com/search?q=${underwriter}+앱`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
                                            앱 열기
                                            <ExternalLink className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}