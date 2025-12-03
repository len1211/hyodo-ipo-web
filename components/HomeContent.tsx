'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Sparkles, BookOpen, ChevronRight } from 'lucide-react'
import { useSession } from "next-auth/react"

// 분리한 컴포넌트와 훅 가져오기
import { useIpoData } from '@/hooks/useIpoData'
import IpoCard from '@/components/ipo/IpoCard'
import IpoCardList from '@/components/ipo/IpoCardList'
import IpoListSection from '@/components/ipo/IpoListSection'

export default function HomeContent() {
    const { data: session } = useSession()
    // 훅 한 줄로 데이터 로딩 끝!
    const { nowIpos, upcomingIpos, isLoading } = useIpoData()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-2xl font-semibold text-gray-700 animate-pulse">
                    데이터를 불러오는 중입니다... 🚀
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                
                {/* 1. 소개글 섹션 */}
                <section className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">👵 효도 청약이란?</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        복잡하고 어려운 공모주 청약, 이제 <strong>'신호등'</strong> 하나로 해결하세요.<br />
                        기관 경쟁률, 의무보유 확약률 등 어려운 지표를 분석하여
                        <strong>초록불(추천)</strong>, <strong>주황불(신중)</strong>, <strong>빨간불(패스)</strong>로 알기 쉽게 보여드립니다.<br />
                        부모님을 위한 가장 쉬운 공모주 비서, 지금 바로 확인해보세요.
                    </p>
                </section>

                {/* 2. 가이드 배너 */}
                <Link href="/guide">
                    <div className="mb-6 bg-white border border-blue-100 rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                                    공모주가 처음이신가요?
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    초보자를 위한 투자 가이드 보러가기
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                </Link>

                {/* 3. 정보 박스 */}
                <div className="mb-8 sm:mb-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 border border-blue-100">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold mb-2 text-balance">오늘의 청약 추천</h2>
                            <p className="text-sm text-muted-foreground text-pretty">
                                신호등 시스템으로 한눈에 보는 공모주 분석
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. 지금 청약 가능 리스트 */}
                {/* <IpoCardList 
                    title="지금 청약 가능"
                    subscriptions={nowIpos}
                    emptyMessage="현재 청약 가능한 종목이 없습니다."
                    dotColorClass="bg-blue-600"
                /> */}

                {/* 5. 곧 시작 리스트 */}
                {/* <IpoCardList 
                    title="곧 시작 (14일 이내)"
                    subscriptions={upcomingIpos}
                    emptyMessage="곧 시작하는 종목이 없습니다."
                    dotColorClass="bg-purple-600"
                /> */}

                {/* 👇 4, 5번 리스트 부분을 컴포넌트로 대체! */}
                <IpoListSection />
            </div>
        </div>
    )
}