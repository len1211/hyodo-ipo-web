'use client'

import { useIpoData } from '@/hooks/useIpoData'
import IpoCardList from '@/components/ipo/IpoCardList'

export default function IpoListSection() {
    // 훅을 여기서 호출합니다.
    const { nowIpos, upcomingIpos, isLoading } = useIpoData()

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700 animate-pulse">
                    데이터를 불러오는 중입니다... 🚀
                </p>
            </div>
        );
    }

    return (
        <>
            {/* 4. 지금 청약 가능 리스트 */}
            <IpoCardList 
                title="지금 청약 가능"
                subscriptions={nowIpos}
                emptyMessage="현재 청약 가능한 종목이 없습니다."
                dotColorClass="bg-blue-600"
            />

            {/* 5. 곧 시작 리스트 */}
            <IpoCardList 
                title="곧 시작 (14일 이내)"
                subscriptions={upcomingIpos}
                emptyMessage="곧 시작하는 종목이 없습니다."
                dotColorClass="bg-purple-600"
            />
        </>
    )
}