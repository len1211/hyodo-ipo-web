// hooks/useIpoData.ts
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { storage } from '@/utils/storage'
import { FirebaseIPO, Subscription } from '@/types/ipo'
import { getIpoStatus, getStatusFromRecommendState, sortSubscriptionsBySchedule } from '@/utils/ipo-helpers'

export const useIpoData = () => {
    const [nowIpos, setNowIpos] = useState<Subscription[]>([])
    const [upcomingIpos, setUpcomingIpos] = useState<Subscription[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchIpos = async () => {
            try {
                const CACHE_KEY = 'ipo_home_data';
                const RAW_CACHE_KEY = 'ipo_raw_cache';

                // 1. 캐시 확인
                const cachedHome = storage.get<{ now: Subscription[], upcoming: Subscription[] }>(CACHE_KEY);
                if (cachedHome) {
                    console.log("✅ 메인페이지: 캐시 데이터 사용");
                    setNowIpos(cachedHome.now);
                    setUpcomingIpos(cachedHome.upcoming);
                    setIsLoading(false);
                    return;
                }

                // 2. DB 요청
                console.log("🔥 메인페이지: DB 요청 발생");
                const snapshot = await getDocs(collection(db, 'ipo_list'))
                const nowList: Subscription[] = []
                const upcomingList: Subscription[] = []
                const rawDataList: FirebaseIPO[] = [];

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

                snapshot.docs.forEach((doc) => {
                    const data = doc.data() as FirebaseIPO
                    rawDataList.push(data);

                    if (!data.schedule) return;

                    // 💡 [수정 포인트 1] 날짜 파싱 보정 (연도 누락 해결)
                    const [startPart, endPart] = data.schedule.split('~');
                    const year = startPart.split('.')[0]; // "2025" 추출
                    
                    // 종료일에 연도가 없으면(예: 12.19) 시작일의 연도를 붙여줌
                    const fullEndDate = endPart?.includes('.') && endPart.split('.')[0].length === 4 
                        ? endPart 
                        : `${year}.${endPart || startPart}`;

                    const statusInfo = getStatusFromRecommendState(data.recommendState)
                    
                    const ipo: Subscription = {
                        id: doc.id,
                        name: data.stockName,
                        category: data.category || data.underwriter?.split(',')[0] || '정보 없음',
                        status: statusInfo.status,
                        statusText: statusInfo.text,
                        // 💡 [수정 포인트 2] .을 -로 변환하여 브라우저 호환성 확보
                        startDate: startPart.trim().replace(/\./g, '-'),
                        endDate: fullEndDate.trim().replace(/\./g, '-'),
                        competitionRatio: data.competitionRate || '-',
                        price: data.price ? `${data.price.replace(' (예정)', '')}원` : '미정',
                        description: data.reason || `기관 경쟁률 ${data.competitionRate || '미정'}. ${data.underwriter || ''} 주관.`,
                    }

                    // 💡 [수정 포인트 3] 상태 판별 함수 호출
                    const { status } = getIpoStatus(data.schedule)
                    
                    if (status === 'now') {
                        ipo.badge = '지금 청약 가능'
                        nowList.push(ipo)
                    } else if (status === 'upcoming') {
                        // 문자열 비교 대신 날짜 객체로 정확히 비교
                        const ipoStartDate = new Date(ipo.startDate);
                        if (ipoStartDate <= twoWeeksFromNow) {
                            ipo.badge = '곧 시작'
                            upcomingList.push(ipo)
                        }
                    }
                })

                const sortedNow = sortSubscriptionsBySchedule(nowList);
                const sortedUpcoming = sortSubscriptionsBySchedule(upcomingList);

                setNowIpos(sortedNow);
                setUpcomingIpos(sortedUpcoming);

                // 3. 캐시 저장
                storage.set(CACHE_KEY, { now: sortedNow, upcoming: sortedUpcoming });
                storage.set(RAW_CACHE_KEY, rawDataList);

            } catch (error) {
                console.error('Failed to load IPO list:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchIpos()
    }, [])

    return { nowIpos, upcomingIpos, isLoading };
}