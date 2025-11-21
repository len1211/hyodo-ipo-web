'use client' // 👈 알맹이는 클라이언트 기능을 씁니다.

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  BookOpen, ChevronDown, ChevronUp, Coins, Clock, BarChart3, AlertTriangle, Home, CheckCircle2
} from 'lucide-react'



// 👇 여기가 핵심입니다! (구글이 좋아하는 고품질 텍스트 콘텐츠)
const guideContents = [
    {
      id: 1,
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      title: "1. 공모주 청약이란? 초보자를 위한 완벽 가이드",
      summary: "주식 초보도 쉽게 이해하는 공모주의 개념과 수익 구조",
      content: `
        <h3 class="text-lg font-bold text-gray-800 mb-2">공모주, 왜 다들 열광할까요?</h3>
        <p class="mb-4">
          '공모주'란 기업이 주식 시장(코스피, 코스닥)에 정식으로 상장하기 전에, 일반 투자자들에게 주식을 공개적으로 파는 것을 말합니다. 
          쉽게 비유하자면 <strong>'아파트 분양'</strong>과 비슷합니다. 다 지어진 아파트를 시장 가격에 사는 게 아니라, 분양가로 미리 싸게 사는 것이죠.
        </p>
        <p class="mb-4">
          공모주가 인기가 많은 이유는 <strong>'높은 확률로 수익을 낼 수 있기 때문'</strong>입니다. 
          보통 공모가는 기업의 실제 가치보다 약간 저렴하게 책정되는 경향이 있습니다. 
          그래서 상장 당일 시장의 관심을 받으면 주가가 공모가보다 훨씬 높게(따상 등) 올라가면서 차익을 실현할 수 있습니다.
        </p>
        <div class="bg-blue-50 p-4 rounded-lg mb-4">
          <strong>💡 핵심 요약</strong>
          <ul class="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>기업이 상장하기 전 주식을 미리 배정받는 것</li>
            <li>일반적으로 상장 당일 주가 상승 가능성이 높음</li>
            <li>소액으로도 참여 가능하며, 초보자에게 적합한 투자법</li>
          </ul>
        </div>
      `
    },
    {
      id: 2,
      icon: <Coins className="h-6 w-6 text-yellow-600" />,
      title: "2. 비례배정과 균등배정의 차이점 쉽게 이해하기",
      summary: "돈이 많아야만 받을 수 있나요? 소액 투자자 필독!",
      content: `
        <h3 class="text-lg font-bold text-gray-800 mb-2">돈이 없어도 1주는 받을 수 있다! (균등배정)</h3>
        <p class="mb-4">
          과거에는 돈(증거금)을 많이 넣은 사람만 주식을 많이 가져가는 '돈 놓고 돈 먹기' 방식이었습니다. 하지만 제도가 바뀌면서 이제는 <strong>'균등배정'</strong>이라는 기회가 생겼습니다.
        </p>
        
        <h4 class="font-bold text-gray-700 mt-4 mb-2">1. 균등배정 (운에 맡기기)</h4>
        <p class="mb-2">
          전체 공모 물량의 50%는 모든 청약자에게 <strong>'N분의 1'</strong>로 나눠줍니다. 
          즉, 1억 원을 넣은 사람이나 최소 증거금(약 20~30만 원)만 넣은 사람이나 똑같이 추첨 기회를 얻습니다. 
          경쟁률이 낮으면 누구나 1주 이상 받고, 경쟁률이 높으면 추첨으로 1주를 받습니다.
        </p>
  
        <h4 class="font-bold text-gray-700 mt-4 mb-2">2. 비례배정 (돈의 힘)</h4>
        <p class="mb-4">
          나머지 50%는 청약 증거금을 많이 넣은 순서대로 나눠줍니다. 보통 몇천만 원, 몇억 원을 넣어야 1주를 더 받을 수 있습니다. 
          자금 여유가 있는 분들은 '비례배정'까지 노려서 더 많은 주식을 확보합니다.
        </p>
  
        <div class="bg-yellow-50 p-4 rounded-lg mb-4">
          <strong>🍯 꿀팁 전략</strong>
          <p class="text-sm mt-1">
            자금이 부족한 초보자라면 <strong>'균등배정'</strong>만 노리세요! 최소 증거금(보통 10주 가격의 50%)만 넣어도 운이 좋으면 1주를 받을 수 있습니다.
          </p>
        </div>
      `
    },
    {
      id: 3,
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "3. 공모주 매도 타이밍 잡는 법: 따상과 따따상",
      summary: "언제 팔아야 최고가일까? 욕심을 버리는 매도 원칙",
      content: `
        <h3 class="text-lg font-bold text-gray-800 mb-2">상장일 아침 9시, 긴장의 순간</h3>
        <p class="mb-4">
          공모주 투자의 완성은 '매도(파는 것)'입니다. 아무리 좋은 주식을 받아도 못 팔면 수익이 아닙니다. 
          상장일 주가는 아침 9시 장 시작과 동시에 엄청나게 변동합니다.
        </p>
  
        <h4 class="font-bold text-gray-700 mt-4 mb-2">📈 용어 정리</h4>
        <ul class="list-disc list-inside mb-4 space-y-1 text-gray-600">
          <li><strong>따상(The Double):</strong> 시초가가 공모가의 2배로 시작해서 상한가(+30%)로 가는 것. (수익률 160%)</li>
          <li><strong>따따상:</strong> 제도가 바뀌어 상장 당일 최대 <strong>공모가의 400%</strong>까지 오를 수 있게 되었습니다.</li>
        </ul>
  
        <h4 class="font-bold text-gray-700 mt-4 mb-2">🏆 초보자를 위한 매도 원칙</h4>
        <p class="mb-2">
          1. <strong>시초가 매도:</strong> 장 시작(09:00) 직후에 시장가로 파는 것이 가장 속 편하고 안전한 수익 실현 방법입니다.
        </p>
        <p class="mb-4">
          2. <strong>욕심 버리기:</strong> "더 오르겠지?" 하다가 순식간에 마이너스로 떨어지는 경우가 많습니다. 줄 때 먹는 것이 진정한 승자입니다.
        </p>
      `
    },
    {
      id: 4,
      icon: <BarChart3 className="h-6 w-6 text-green-600" />,
      title: "4. 공모주 투자 시 꼭 확인해야 할 3가지 지표",
      summary: "이것만 알면 손해 안 봅니다. 마이너스 피하는 법",
      content: `
        <h3 class="text-lg font-bold text-gray-800 mb-2">신호등이 알려주는 3가지 핵심 데이터</h3>
        <p class="mb-4">
          저희 '효도 청약' 앱이 초록불/빨간불을 띄우는 기준이기도 합니다. 이 3가지만 확인하면 깡통 찰 일은 없습니다.
        </p>
  
        <div class="space-y-4">
          <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-bold text-gray-900">1. 기관 경쟁률 (높을수록 좋음)</h4>
            <p class="text-sm text-gray-600">
              기관 투자자들이 얼마나 이 주식을 사고 싶어 하는지 보여줍니다. 
              보통 <strong>1,000:1 이상</strong>이면 '양호', <strong>1,500:1 이상</strong>이면 '대박'입니다.
            </p>
          </div>
          <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-bold text-gray-900">2. 의무보유 확약 비율 (높을수록 좋음)</h4>
            <p class="text-sm text-gray-600">
              기관들이 주식을 받고 나서 "일정 기간 동안 안 팔겠다"고 약속한 비율입니다. 
              이 비율이 높으면 상장 당일 쏟아지는 매물이 적어 주가가 오를 확률이 높습니다. 
              <strong>20~30% 이상</strong>이면 좋은 편입니다.
            </p>
          </div>
          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-bold text-gray-900">3. 유통 가능 물량 (낮을수록 좋음)</h4>
            <p class="text-sm text-gray-600">
              상장 첫날 시장에 풀릴 수 있는 주식의 양입니다. 
              이게 너무 많으면(40% 이상) 매도 폭탄이 떨어져 주가가 오르기 힘듭니다.
            </p>
          </div>
        </div>
      `
    },
    {
      id: 5,
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      title: "5. 증거금 계산하는 방법과 환불일 알아보기",
      summary: "내 돈은 언제 돌려받나요? 자금 계획 세우기",
      content: `
        <h3 class="text-lg font-bold text-gray-800 mb-2">돈은 얼마나 필요할까?</h3>
        <p class="mb-4">
          공모주 청약을 하려면 <strong>'청약 증거금'</strong>을 증권사 계좌에 미리 넣어둬야 합니다. 
          보통 청약하려는 금액의 <strong>50%</strong>가 필요합니다.
        </p>
        
        <div class="bg-gray-100 p-4 rounded text-center font-mono text-sm mb-4">
          필요한 돈 = (공모가 × 희망 주식 수) ÷ 2
        </div>
  
        <p class="mb-4">
          예를 들어, 공모가가 10,000원이고 '균등배정(최소수량 10주)'을 노린다면?<br/>
          (10,000원 × 10주) ÷ 2 = <strong>50,000원</strong>만 있으면 청약이 가능합니다.
        </p>
  
        <h4 class="font-bold text-gray-700 mt-4 mb-2">💸 남은 돈은 언제 돌려받나요? (환불일)</h4>
        <p class="mb-2">
          청약이 끝나고 보통 <strong>2일 뒤(영업일 기준)</strong>에 환불됩니다. 
          월요일에 청약하면 수요일에, 금요일에 청약하면 다음 주 화요일에 돌려받습니다.
        </p>
        <p class="text-red-600 text-sm font-semibold">
          주의: 마이너스 통장을 써서 청약할 경우, 환불일까지의 이자를 꼭 계산해봐야 합니다!
        </p>
      `
    }
  ]
  // 함수 이름을 GuidePage -> GuideContent로 변경
  export default function GuideContent() {
    // 어떤 글이 열려있는지 관리하는 State (초기값: 첫 번째 글 열림)
    const [openId, setOpenId] = useState<number | null>(1);
  
    const toggleAccordion = (id: number) => {
      setOpenId(openId === id ? null : id);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              💡 공모주 투자 가이드
            </h1>
            <p className="text-lg text-gray-600">
              초보자도 5분이면 마스터! <br className="sm:hidden"/> 실패 없는 투자를 위한 필수 지식
            </p>
          </div>
  
          {/* 콘텐츠 리스트 (아코디언) */}
          <div className="space-y-4">
            {guideContents.map((guide) => (
              <Card key={guide.id} className="border-l-4 border-l-blue-500 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  onClick={() => toggleAccordion(guide.id)}
                  className="cursor-pointer bg-white p-6 flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex flex-shrink-0 mt-1">{guide.icon}</div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                        {guide.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">{guide.summary}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-gray-400">
                    {openId === guide.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>
                
                {/* 펼쳐지는 내용 */}
                {openId === guide.id && (
                  <div className="bg-gray-50 border-t px-6 py-8 animate-in slide-in-from-top-2 duration-200">
                    {/* HTML 태그를 해석해서 보여줌 (dangerouslySetInnerHTML) */}
                    <div 
                      className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: guide.content }} 
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
  
          {/* 하단 버튼 */}
          <div className="mt-12 text-center">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 px-10 rounded-full shadow-lg hover:scale-105 transition-transform">
                <Home className="mr-2 h-5 w-5" />
                실전 종목 보러가기
              </Button>
            </Link>
          </div>
  
        </div>
      </div>
    )
  }