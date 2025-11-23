'use client'

import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase"; // 경로 주의 (../app/firebase)
import { storage } from '@/utils/storage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, AlertCircle, XCircle, Building, Calendar, TrendingUp, FileText, ExternalLink, Share2 } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script';


type FirebaseIPO = {
    stockName: string;
    schedule: string;
    price: string;
    minDeposit: string;
    competitionRate: string;
    retailCompetition?: string;
    recommendState: string;
    underwriter: string;
    reason?: string;
    category?: string;
    lockupRate?: string;
    listingDate?: string;
}

const brokersLinks: Record<string, string> = {
    '토스증권': 'https://tossinvest.com',
    '카카오페이증권': 'https://kakaopay.com',
    'KB증권': 'https://m.kbsec.com',
    '미래에셋증권': 'https://securities.miraeasset.com/mobile/index.jsp',
    '삼성증권': 'https://www.samsungpop.com',
    '한국투자증권': 'https://www.truefriend.com/main/main.jsp',
    'NH투자증권': 'https://m.namuh.com',
    '키움증권': 'https://www.kiwoom.com/h/main',
    '신한투자증권': 'https://www.shinhansec.com',
    '하나증권': 'https://www.hanaw.com',
    '대신증권': 'https://www.daishin.com',
    '유안타증권': 'https://www.myasset.com',
    '한화투자증권': 'https://www.hanwhawm.com',
    '신영증권': 'https://www.shinyoung.com',
    '현대차증권': 'https://www.hmsec.com',
    '하이투자증권': 'https://www.hi-ib.com',
    'DB금융투자': 'https://www.db-fi.com',
    'IBK투자증권': 'https://www.ibks.com',
    '유진투자증권': 'https://www.eugenefn.com',
    '교보증권': 'https://www.iprovest.com',
    'LS증권': 'https://www.ls-sec.co.kr',
}

// 👇 props로 id(종목명)를 받습니다.
export default function IPODetailContent({ id }: { id: string }) {

    const [data, setData] = useState<FirebaseIPO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const params = useParams(); // 껍데기에서 id를 주므로 이건 필요 없음

    useEffect(() => {
        if (id) {
            const fetchDoc = async () => {
                try {
                    const targetName = decodeURIComponent(id);

                    // ⭐ [캐싱 로직 추가] 1. 캐시 먼저 확인하기 ⭐
                    const RAW_CACHE_KEY = 'ipo_raw_cache';
                    const cachedRawList = storage.get<FirebaseIPO[]>(RAW_CACHE_KEY);

          if (cachedRawList) {
            // 캐시 리스트에서 현재 들어온 종목(targetName)을 찾음
            const found = cachedRawList.find(item => item.stockName === targetName);
            
            if (found) {
              console.log(`✅ 상세페이지(${targetName}): 캐시 데이터 사용 (비용 0원)`);
              setData(found);
              setIsLoading(false);
              return; // 🚨 DB 요청 안 하고 여기서 끝냄!
            }
          }

                    // 2. 캐시에 없으면 어쩔 수 없이 DB 조회 (비용 발생)
                    console.log(`🔥 상세페이지(${targetName}): DB 조회 발생`);
                    const docRef = doc(db, "ipo_list", targetName);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setData(docSnap.data() as FirebaseIPO);
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDoc();
        }
    }, [id]);

    const [kakaoSdkLoaded, setKakaoSdkLoaded] = useState(false);

    const shareKakao = () => {
        if (!data) return;
        if (window.Kakao && kakaoSdkLoaded) {
            window.Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: `[효도 청약] ${data.stockName} 청약 정보`,
                    description: data.reason ? data.reason.substring(0, 50) + "..." : "경쟁률과 확약률을 확인하세요!",
                    imageUrl: "https://hyodo-care.com/og-image.png",
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
                buttons: [
                    {
                        title: "정보 보러가기",
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href,
                        },
                    },
                ],
            });
        } else {
            alert("공유 기능을 준비 중입니다. 잠시만 기다려주세요.");
        }
    };

    const getStatusConfig = (recommendState: string = "") => {
        // 1. 빨간불 먼저 검사
        if (recommendState.includes("패스") || recommendState.includes("비추천") || recommendState.includes("마세요")) {
            return {
                icon: XCircle,
                color: 'text-red-600',
                badgeBg: 'bg-red-100',
                badgeText: 'text-red-800',
                badgeBorder: 'border-red-300',
                statusText: '청약 비추천'
            }
        }
        // 2. 초록불 검사
        if (recommendState.includes("추천") || recommendState.includes("강력")) {
            return {
                icon: CheckCircle,
                color: 'text-green-600',
                badgeBg: 'bg-green-100',
                badgeText: 'text-green-800',
                badgeBorder: 'border-green-300',
                statusText: '적극 추천'
            }
        }
        // 3. 노란불 검사
        if (recommendState.includes("보통") || recommendState.includes("신중")) {
            return {
                icon: AlertCircle,
                color: 'text-orange-500',
                badgeBg: 'bg-orange-100',
                badgeText: 'text-orange-800',
                badgeBorder: 'border-orange-300',
                statusText: '신중하게'
            }
        }
        // 4. 기본값
        return {
            icon: AlertCircle,
            color: 'text-gray-500',
            badgeBg: 'bg-gray-100',
            badgeText: 'text-gray-800',
            badgeBorder: 'border-gray-300',
            statusText: '아직 모름'
        }
    }

    if (isLoading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-2xl font-semibold text-gray-700 animate-pulse">
                    데이터를 불러오는 중입니다... 🚀
                </p>
            </div>
        );
    }

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
                                        href={brokersLinks[underwriter] || `https://www.google.com/search?q=${underwriter}+앱`}
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

                {/* 카카오톡 공유 버튼
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full max-w-xs text-base py-6 bg-yellow-300 text-black hover:bg-yellow-400 font-bold border-yellow-400"
            onClick={shareKakao}
            disabled={!kakaoSdkLoaded}
          >
            <Share2 className="mr-2 h-5 w-5" />
            카톡으로 공유하기
          </Button>
        </div> */}

            </div>
        </div>
    )
}