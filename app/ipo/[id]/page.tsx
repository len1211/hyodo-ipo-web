'use client' // 👈 (추가!)

// 1. 필요한 React 및 Firebase 도구 가져오기
import { useEffect, useState } from 'react';
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { db } from "../../firebase"; // 👈 Firebase 설정 파일
import { useParams } from 'next/navigation'; // 👈 (수정!)

// 2. shadcn/ui 컴포넌트 (승환님이 가져오신 코드)
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShareButton } from '@/components/share-button'
import { CheckCircle, AlertCircle, XCircle, Building, Calendar, TrendingUp, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// 3. (중요!) Java DB의 필드명 정의
type FirebaseIPO = {
  stockName: string;
  schedule: string;
  price: string;
  minDeposit: string;
  competitionRate: string; // 기관 경쟁률
  retailCompetition?: string; // 일반 경쟁률 (Java에서 추가 크롤링 필요)
  recommendState: string; // "🟢 강력 추천"
  underwriter: string;
  reason?: string; // AI가 요약한 추천 사유
  category?: string; // 상세 크롤링한 업종
  lockupRate?: string; // 상세 크롤링한 의무보유확약
  listingDate?: string; // 상장일 (Java에서 추가 크롤링 필요)
}

const brokersLinks: Record<string, string> = {
  '삼성증권': 'https://www.samsungpop.com',
  '미래에셋증권': 'https://securities.miraeasset.com',
  'KB증권': 'https://www.kbsec.com',
  '한투증권': 'https://www.hanaw.com',
  'NH투자증권': 'https://www.nhqv.com',
  '신한투자증권': 'https://www.shinhansec.com/',
  '교보증권': 'https://www.iprovest.com/',
  // ... (Java 크롤러가 가져오는 모든 증권사 추가)
}

// 4. (삭제!) 가짜 데이터 삭제
// const subscriptionData: Record<string, any> = { ... }

export default function IPODetailPage() { // 👈 (수정!)
  
  // 5. (추가!) State 및 라우터 설정
  const [data, setData] = useState<FirebaseIPO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams(); // 👈 URL에서 id 가져오기
  const id = params?.id as string; // URL의 id는 stockName임

  // 6. (추가!) Firebase 데이터 로딩 로직
  useEffect(() => {
    if (id) {
      const fetchDoc = async () => {
        try {
          // URL의 id(디코딩 필요)로 문서를 찾음
          const docRef = doc(db, "ipo_list", decodeURIComponent(id));
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


  // --- (디자인 코드는 승환님이 주신 것 그대로 사용) ---

  const getStatusConfig = (recommendState: string = "") => {
    if (recommendState.includes("추천")) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-800',
        badgeBorder: 'border-green-300',
        statusText: '적극 추천'
      }
    }
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
     if (recommendState.includes("패스") || recommendState.includes("마세요")) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        badgeBg: 'bg-red-100',
        badgeText: 'text-red-800',
        badgeBorder: 'border-red-300',
        statusText: '청약 비추천'
      }
    }
    // 기본값 또는 "아직 모름"
    return {
      icon: AlertCircle,
      color: 'text-gray-500',
      badgeBg: 'bg-gray-100',
      badgeText: 'text-gray-800',
      badgeBorder: 'border-gray-300',
      statusText: '아직 모름'
    }
  }

  // 7. (추가!) 로딩 화면
  if (isLoading || !data) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-2xl font-semibold text-gray-700 animate-pulse">
          데이터를 불러오는 중입니다... 🚀
        </p>
      </div>
    );
  }

  // 8. (수정!) DB 데이터로 화면 그리기
  const statusConfig = getStatusConfig(data.recommendState);
  const StatusIcon = statusConfig.icon;
  const underwriters = data.underwriter?.split(',') || ['정보 없음'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* 헤더 */}
        <div className="mb-4 sm:mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 hover:bg-gray-100"
            >
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
                <div
                  key={index}
                  className="bg-white border-2 border-gray-300 rounded-lg p-3 sm:p-4 flex items-center justify-between hover:border-blue-400 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base">{underwriter}</span>
                  <Link
                    href={brokersLinks[underwriter] || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                    >
                      청약하기
                      <ExternalLink className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* (주석 처리) ShareButton은 shadcn/ui 기본 컴포넌트가 아니므로 일단 주석처리합니다.
        <div className="mt-6 flex justify-center">
          <ShareButton
            title={`${data.stockName} 청약 정보`}
            description={`${statusConfig.statusText}: ${data.reason?.substring(0, 50)}...`}
            url={`https://yourdomain.com/ipo/${id}`}
          />
        </div>
        */}
      </div>
    </div>
  )
}