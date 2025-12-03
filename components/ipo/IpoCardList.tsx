'use client'

import { Badge } from '@/components/ui/badge'
import IpoCard from '@/components/ipo/IpoCard'
import { Subscription } from '@/types/ipo'

interface IpoCardListProps {
    title: string;          // 섹션 제목 (예: "지금 청약 가능")
    subscriptions: Subscription[]; // 데이터 리스트
    emptyMessage: string;   // 데이터 없을 때 보여줄 문구
    dotColorClass: string;  // 제목 옆 점 색상 (예: "bg-blue-600")
}

export default function IpoCardList({ 
    title, 
    subscriptions, 
    emptyMessage, 
    dotColorClass 
}: IpoCardListProps) {
    return (
        <section className="mb-8 sm:mb-10 last:mb-0">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className={`h-2 w-2 rounded-full ${dotColorClass}`}></div>
                <h2 className="text-xl sm:text-2xl font-bold text-balance">{title}</h2>
                <Badge variant="secondary" className="text-sm px-2.5 py-0.5">
                    {subscriptions.length}개
                </Badge>
            </div>
            
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                {subscriptions.length === 0 ? (
                    <p className="text-gray-500 col-span-2 py-4">{emptyMessage}</p>
                ) : (
                    subscriptions.map((subscription) => (
                        <IpoCard key={subscription.id} subscription={subscription} />
                    ))
                )}
            </div>
        </section>
    )
}