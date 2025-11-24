'use client'

// 1. 필요한 React 및 Firebase 도구 가져오기
import { useEffect, useState } from 'react'
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
import { db } from '../app/firebase' // 👈 Firebase 설정 파일
import Link from 'next/link'

// 2. shadcn/ui 컴포넌트 (승환님이 가져오신 코드)
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Calendar, Users, TrendingUp, Building, AlertCircle, CheckCircle, XCircle, BookOpen, ChevronRight, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

// 👇 아까 만든 캐시 도구 가져오기 (파일이 있어야 합니다!)
import { storage } from '@/utils/storage'

// 3. (중요!) Java DB의 필드명 정의 (이거에 맞춰서 가져옴)
export type FirebaseIPO = {
    stockName: string;
    schedule: string;
    price: string;
    minDeposit: string;
    competitionRate: string;
    recommendState: string; // "🟢 강력 추천"
    underwriter: string;
    reason?: string; // AI가 요약한 추천 사유
    category?: string; // 상세 크롤링한 업종
    lockupRate?: string; // 상세 크롤링한 의무보유확약
    retailCompetition?: string;
    listingDate?: string;
}

// 4. (중요!) 디자인에 필요한 데이터 타입 (승환님이 가져오신 코드)
interface Subscription {
    id: string
    name: string
    category: string
    status: 'recommended' | 'caution' | 'not-recommended'
    statusText: string
    startDate: string
    endDate: string
    competitionRatio: string
    price: string
    description: string
    badge?: string
}

// ---
// 헬퍼 함수: 날짜 문자열을 받아서 [상태]와 [시작일]을 반환하도록 수정
// ---
const getIpoStatus = (schedule: string): { status: 'now' | 'upcoming' | 'finished', startDate: Date } => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 자정 기준

        const parts = schedule.split("~");
        const startDateStr = parts[0].trim();

        const parseDatePart = (partStr: string, baseYear: number, baseMonth: number): Date => {
            const p = partStr.split(".").map(Number);
            if (p.length === 3) return new Date(p[0], p[1] - 1, p[2]); // 2025.11.18
            if (p.length === 2) return new Date(baseYear, p[0] - 1, p[1]); // 11.19
            if (p.length === 1) return new Date(baseYear, baseMonth, p[0]); // 19 (같은 월)
            return new Date(0); // Invalid
        };

        const startParts = startDateStr.split(".").map(Number);
        if (startParts.length < 3) return { status: 'finished', startDate: new Date(0) }; // 잘못된 형식
        const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);

        let endDate = new Date(startDate);
        if (parts.length > 1) {
            const endDateStr = parts[1].trim();
            endDate = parseDatePart(endDateStr, startDate.getFullYear(), startDate.getMonth());
        }
        endDate.setHours(23, 59, 59, 999);

        if (today >= startDate && today <= endDate) return { status: "now", startDate };
        if (today < startDate) return { status: "upcoming", startDate };
        return { status: "finished", startDate };

    } catch (error) {
        return { status: 'finished', startDate: new Date(0) }
    }
}

// ... (parseStartDateValue, sortSubscriptionsBySchedule 헬퍼 함수는 그대로) ...
const parseStartDateValue = (dateText?: string) => {
    if (!dateText) return Number.MAX_SAFE_INTEGER
    const parts = dateText
        .split('.')
        .map((part) => Number(part.trim()))
        .filter((part) => !Number.isNaN(part))

    if (parts.length === 3) {
        const [year, month, day] = parts
        return new Date(year, month - 1, day).getTime()
    }

    if (parts.length === 2) {
        const now = new Date()
        const [month, day] = parts
        return new Date(now.getFullYear(), month - 1, day).getTime()
    }

    return Number.MAX_SAFE_INTEGER
}

const sortSubscriptionsBySchedule = (items: Subscription[]) =>
    [...items].sort((a, b) => {
        const aDate = parseStartDateValue(a.startDate)
        const bDate = parseStartDateValue(b.startDate)
        if (aDate === bDate) {
            return a.name.localeCompare(b.name, 'ko')
        }
        return aDate - bDate
    })

// 캐시 삭제 및 새로고침 함수
const handleRefresh = () => {
    // 1. 저장된 캐시 삭제 (storage 도구 사용)
    storage.remove('ipo_home_data');
    storage.remove('ipo_raw_cache');
    storage.remove('ipo_data_timestamp');

    // 2. 페이지 새로고침 (그러면 다시 DB에서 긁어옴)
    window.location.reload();
};


// ---
// 헬퍼 함수: "🟢 강력 추천" -> { status: 'recommended', text: '적극 추천' }
// ---
const getStatusFromRecommendState = (recommendState: string) => {
    if (recommendState.includes("추천")) {
        return { status: 'recommended' as const, text: '적극 추천' };
    }
    if (recommendState.includes("보통") || recommendState.includes("신중")) {
        return { status: 'caution' as const, text: '신중하게' };
    }
    if (recommendState.includes("패스") || recommendState.includes("마세요")) {
        return { status: 'not-recommended' as const, text: '청약 비추천' };
    }
    return { status: 'caution' as const, text: '아직 모름' };
}


// ---
// 메인 페이지 컴포넌트
// ---
export default function HomeContent() {
    const router = useRouter()

    const [nowIpos, setNowIpos] = useState<Subscription[]>([])
    const [upcomingIpos, setUpcomingIpos] = useState<Subscription[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // 7. (추가!) Firebase 데이터 로딩 로직
    useEffect(() => {
        const fetchIpos = async () => {
            try {
                // 캐시 키 정의
                const CACHE_KEY = 'ipo_home_data';       // 화면에 보여줄 리스트용
                const RAW_CACHE_KEY = 'ipo_raw_cache';   // 상세 페이지에 넘겨줄 원본 데이터용

                // 1. 캐시 확인 로직 (storage 유틸리티 사용)
                // store.get 내부에서 시간 체크까지 다 해줍니다.
                const cachedHome = storage.get<{ now: Subscription[], upcoming: Subscription[] }>(CACHE_KEY);

                if (cachedHome) {
                    console.log("✅ 메인페이지: 캐시 데이터 사용 (비용 0원)");
                    setNowIpos(cachedHome.now);
                    setUpcomingIpos(cachedHome.upcoming);
                    setIsLoading(false);
                    return; // 🚨 여기서 함수 종료! (DB 요청 안 함)
                }

                // 캐시가 없으면 DB 요청 시작
                console.log("🔥 메인페이지: DB 요청 발생 (비용 발생)");

                const snapshot = await getDocs(collection(db, 'ipo_list'))
                const nowList: Subscription[] = []
                const upcomingList: Subscription[] = []

                // 원본 데이터를 담을 배열 (상세페이지 공유용)
                const rawDataList: FirebaseIPO[] = [];

                // (수정!) 14일 필터링을 위한 기준 날짜
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

                snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data() as FirebaseIPO

                    // 원본 데이터 수집 (상세 페이지 공유용)
                    rawDataList.push(data);

                    const statusInfo = getStatusFromRecommendState(data.recommendState)

                    const ipo: Subscription = {
                        id: doc.id,
                        name: data.stockName,
                        category: data.category || data.underwriter?.split(',')[0] || '정보 없음',
                        status: statusInfo.status,
                        statusText: statusInfo.text,
                        startDate: data.schedule?.split('~')[0] || '미정',
                        endDate: data.schedule?.split('~')[1] || data.schedule?.split('~')[0] || '미정',
                        competitionRatio: data.competitionRate || '-',
                        price: data.price ? `${data.price.replace(' (예정)', '')}원` : '미정',
                        description: data.reason || `기관 경쟁률 ${data.competitionRate || '미정'}. ${data.underwriter || ''} 주관.`,
                    }

                    if (!data.schedule) return; // 날짜 정보 없으면 무시

                    // (수정!) 헬퍼 함수에서 status와 startDate를 모두 받아옴
                    const { status, startDate } = getIpoStatus(data.schedule)

                    if (status === 'now') {
                        ipo.badge = '지금 청약 가능'
                        nowList.push(ipo)
                    } else if (status === 'upcoming') {
                        // (수정!) 14일 이내 시작하는 것만 리스트에 추가
                        if (startDate <= twoWeeksFromNow) {
                            ipo.badge = '곧 시작'
                            upcomingList.push(ipo)
                        }
                    }
                })

                const sortedNow = sortSubscriptionsBySchedule(nowList);
                const sortedUpcoming = sortSubscriptionsBySchedule(upcomingList);

                setNowIpos(sortedNow);
                setUpcomingIpos(sortedUpcoming);

                // 데이터를 다 만들었으니 캐시에 저장 (다음 접속을 위해)
                // 1. 화면 데이터 저장
                storage.set(CACHE_KEY, { now: sortedNow, upcoming: sortedUpcoming });
                // 2. 원본 데이터 저장 (상세 페이지에서 갖다 씀)
                storage.set(RAW_CACHE_KEY, rawDataList);
            } catch (error) {
                console.error('Failed to load IPO list:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchIpos()
    }, [])


    // --- (디자인 코드는 승환님이 주신 것 그대로 사용) ---

    const getStatusIcon = (status: Subscription['status']) => {
        switch (status) {
            case 'recommended':
                return <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={3} />
            case 'caution':
                return <AlertCircle className="h-12 w-12 text-orange-500" strokeWidth={3} />
            case 'not-recommended':
                return <XCircle className="h-12 w-12 text-red-600" strokeWidth={3} />
        }
    }

    const getStatusBadgeColor = (status: Subscription['status']) => {
        switch (status) {
            case 'recommended':
                return 'bg-green-50 text-green-700 border-green-200'
            case 'caution':
                return 'bg-orange-50 text-orange-700 border-orange-200'
            case 'not-recommended':
                return 'bg-red-50 text-red-700 border-red-200'
        }
    }

    const SubscriptionCard = ({ subscription }: { subscription: Subscription }) => (
        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                    <div className="flex-1 w-full">
                        {subscription.badge && (
                            <Badge className="mb-2 text-sm px-2.5 py-0.5" variant="secondary">
                                {subscription.badge}
                            </Badge>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-balance">{subscription.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{subscription.category}</span>
                        </div>
                    </div>
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-2 w-full sm:w-auto justify-center sm:justify-start sm:ml-4">
                        {getStatusIcon(subscription.status)}
                        <Badge className={`text-sm font-semibold px-3 py-1 ${getStatusBadgeColor(subscription.status)}`}>
                            {subscription.statusText}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">청약 기간</span>
                        <span className="font-semibold sm:ml-auto text-balance">
                            {subscription.startDate} ~ {subscription.endDate}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">기관 경쟁률</span>
                        <span className="font-bold text-blue-600 ml-auto text-base sm:text-lg">
                            {subscription.competitionRatio}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">공모가</span>
                        <span className="font-bold ml-auto text-base sm:text-lg">{subscription.price}</span>
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground mb-4 text-pretty">
                    {subscription.description}
                </p>

                <Button
                    className="w-full text-base py-5 sm:py-6 font-semibold"
                    size="lg"
                    onClick={() => router.push(`/ipo/${encodeURIComponent(subscription.name)}`)}
                >
                    자세히 보기
                </Button>
            </CardContent>
        </Card>
    )

    // 8. (추가!) 로딩 화면
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-2xl font-semibold text-gray-700 animate-pulse">
                    데이터를 불러오는 중입니다... 🚀
                </p>
            </div>
        );
    }

    // 9. (수정!) JSX 렌더링 부분을 진짜 데이터 State로 변경
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">

                {/* 1. 헤더 */}
                <header className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-balance">효도 청약</h1>
                    {/* ⭐ [추가] 새로고침 버튼 (우측 상단 배치) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 text-gray-400 hover:text-blue-600"
                        onClick={handleRefresh}
                        title="최신 데이터로 새로고침"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </header>

                {/* ⭐ [추가] 로봇에게 보여줄 사이트 소개글 (SEO & 애드센스용) ⭐ */}
                <section className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">👵 효도 청약이란?</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        복잡하고 어려운 공모주 청약, 이제 <strong>'신호등'</strong> 하나로 해결하세요.<br />
                        기관 경쟁률, 의무보유 확약률 등 어려운 지표를 분석하여
                        <strong>초록불(추천)</strong>, <strong>노란불(신중)</strong>, <strong>빨간불(패스)</strong>로 알기 쉽게 보여드립니다.<br />
                        부모님을 위한 가장 쉬운 공모주 비서, 지금 바로 확인해보세요.
                    </p>
                </section>



                {/* ⭐ [추가] 가이드 페이지 이동 배너 (여기가 명당입니다!) ⭐ */}
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

                {/* 2. 기존 정보 박스 (파란색 그라데이션) */}
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

                <section className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <h2 className="text-xl sm:text-2xl font-bold text-balance">지금 청약 가능</h2>
                        <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
                            {nowIpos.length}개
                        </Badge>
                    </div>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                        {nowIpos.length === 0 ? (
                            <p className="text-gray-500 col-span-2">현재 청약 가능한 종목이 없습니다.</p>
                        ) : (
                            nowIpos.map((subscription) => (
                                <SubscriptionCard key={subscription.id} subscription={subscription} />
                            ))
                        )}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                        {/* (수정!) 섹션 제목 변경 */}
                        <h2 className="text-xl sm:text-2xl font-bold text-balance">곧 시작 (14일 이내)</h2>
                        <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
                            {upcomingIpos.length}개
                        </Badge>
                    </div>
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                        {upcomingIpos.length === 0 ? (
                            <p className="text-gray-500 col-span-2">곧 시작하는 종목이 없습니다.</p>
                        ) : (
                            upcomingIpos.map((subscription) => (
                                <SubscriptionCard key={subscription.id} subscription={subscription} />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}