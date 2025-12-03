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

                // 1. 캐시 확인 (있으면 바로 리턴)
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
                    rawDataList.push(data); // 상세 페이지용 원본 저장

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

                    if (!data.schedule) return;

                    const { status, startDate } = getIpoStatus(data.schedule)
                    if (status === 'now') {
                        ipo.badge = '지금 청약 가능'
                        nowList.push(ipo)
                    } else if (status === 'upcoming') {
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

                // 3. 캐시 저장
                storage.set(CACHE_KEY, { now: sortedNow, upcoming: sortedUpcoming });
                storage.set(RAW_CACHE_KEY, rawDataList); // 상세 페이지를 위한 원본 저장

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