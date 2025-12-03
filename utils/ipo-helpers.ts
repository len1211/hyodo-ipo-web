// utils/ipo-helpers.ts
import { Subscription } from '@/types/ipo';

// 날짜 문자열 파싱 및 상태 계산
export const getIpoStatus = (schedule: string): { status: 'now' | 'upcoming' | 'finished', startDate: Date } => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parts = schedule.split("~");
        const startDateStr = parts[0].trim();

        const parseDatePart = (partStr: string, baseYear: number, baseMonth: number): Date => {
            const p = partStr.split(".").map(Number);
            if (p.length === 3) return new Date(p[0], p[1] - 1, p[2]);
            if (p.length === 2) return new Date(baseYear, p[0] - 1, p[1]);
            if (p.length === 1) return new Date(baseYear, baseMonth, p[0]);
            return new Date(0);
        };

        const startParts = startDateStr.split(".").map(Number);
        if (startParts.length < 3) return { status: 'finished', startDate: new Date(0) };
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

// 추천 상태 텍스트 변환
export const getStatusFromRecommendState = (recommendState: string) => {
    if (recommendState.includes("추천")) return { status: 'recommended' as const, text: '적극 추천' };
    if (recommendState.includes("보통") || recommendState.includes("신중")) return { status: 'caution' as const, text: '신중하게' };
    if (recommendState.includes("패스") || recommendState.includes("마세요")) return { status: 'not-recommended' as const, text: '청약 비추천' };
    return { status: 'caution' as const, text: '아직 모름' };
}

// 날짜순 정렬
const parseStartDateValue = (dateText?: string) => {
    if (!dateText) return Number.MAX_SAFE_INTEGER
    const parts = dateText.split('.').map((part) => Number(part.trim())).filter((part) => !Number.isNaN(part))
    if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2]).getTime()
    if (parts.length === 2) return new Date(new Date().getFullYear(), parts[0] - 1, parts[1]).getTime()
    return Number.MAX_SAFE_INTEGER
}

export const sortSubscriptionsBySchedule = (items: Subscription[]) =>
    [...items].sort((a, b) => {
        const aDate = parseStartDateValue(a.startDate)
        const bDate = parseStartDateValue(b.startDate)
        if (aDate === bDate) return a.name.localeCompare(b.name, 'ko')
        return aDate - bDate
    })