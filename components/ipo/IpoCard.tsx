'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Subscription } from '@/types/ipo'
import { 
  Building, Calendar, Users, TrendingUp, 
  CheckCircle, AlertCircle, XCircle 
} from 'lucide-react'

// UI 헬퍼 함수 (컴포넌트 내부 사용)
const getStatusIcon = (status: Subscription['status']) => {
    switch (status) {
        case 'recommended': return <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={3} />
        case 'caution': return <AlertCircle className="h-12 w-12 text-orange-500" strokeWidth={3} />
        case 'not-recommended': return <XCircle className="h-12 w-12 text-red-600" strokeWidth={3} />
    }
}

const getStatusBadgeColor = (status: Subscription['status']) => {
    switch (status) {
        case 'recommended': return 'bg-green-50 text-green-700 border-green-200'
        case 'caution': return 'bg-orange-50 text-orange-700 border-orange-200'
        case 'not-recommended': return 'bg-red-50 text-red-700 border-red-200'
    }
}

interface IpoCardProps {
    subscription: Subscription;
}

export default function IpoCard({ subscription }: IpoCardProps) {
    const router = useRouter()

    return (
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
}