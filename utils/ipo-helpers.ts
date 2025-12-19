// utils/ipo-helpers.ts
import { Subscription } from '@/types/ipo';

// 날짜 문자열 파싱 (대시와 점 모두 대응)
const parseFlexibleDate = (dateStr: string, baseYear?: number, baseMonth?: number): Date => {
    // 모든 구분자를 점(.)으로 통일 후 숫자 배열로 변환
    const p = dateStr.replace(/-/g, '.').split(".").map(Number);

    if (p.length === 3) return new Date(p[0], p[1] - 1, p[2]);
    if (p.length === 2 && baseYear !== undefined) return new Date(baseYear, p[0] - 1, p[1]);
    if (p.length === 1 && baseYear !== undefined && baseMonth !== undefined) return new Date(baseYear, baseMonth, p[0]);
    
    return new Date(0);
};

// 날짜 문자열 파싱 및 상태 계산
export const getIpoStatus = (schedule: string): { status: 'now' | 'upcoming' | 'finished', startDate: Date } => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parts = schedule.split("~");
        const startDateStr = parts[0].trim();

        // 시작일 파싱
        const startDate = parseFlexibleDate(startDateStr);
        if (startDate.getTime() === 0) return { status: 'finished', startDate: new Date(0) };

        // 종료일 파싱
        let endDate = new Date(startDate);
        if (parts.length > 1) {
            const endDateStr = parts[1].trim();
            endDate = parseFlexibleDate(endDateStr, startDate.getFullYear(), startDate.getMonth());
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
    const state = recommendState || "";
    if (state.includes("추천")) return { status: 'recommended' as const, text: '적극 추천' };
    if (state.includes("보통") || state.includes("신중")) return { status: 'caution' as const, text: '신중하게' };
    if (state.includes("패스") || state.includes("마세요")) return { status: 'not-recommended' as const, text: '청약 비추천' };
    return { status: 'caution' as const, text: '아직 모름' };
}

// 날짜순 정렬을 위한 값 추출
const parseStartDateValue = (dateText?: string) => {
    if (!dateText || dateText === '미정') return Number.MAX_SAFE_INTEGER;
    
    // 점(.)이나 대시(-) 모두 날짜 객체로 변환 시도
    const date = new Date(dateText.replace(/\./g, '-'));
    return isNaN(date.getTime()) ? Number.MAX_SAFE_INTEGER : date.getTime();
}

export const sortSubscriptionsBySchedule = (items: Subscription[]) =>
    [...items].sort((a, b) => {
        const aDate = parseStartDateValue(a.startDate)
        const bDate = parseStartDateValue(b.startDate)
        if (aDate === bDate) return a.name.localeCompare(b.name, 'ko')
        return aDate - bDate
    })