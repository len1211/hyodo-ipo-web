'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyContent() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">

                {/* 뒤로가기 버튼 */}
                <div className="mb-6">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            메인으로 돌아가기
                        </Button>
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">
                    이용약관 및 개인정보처리방침
                </h1>

                <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-900">1. 개인정보처리방침</h2>
                        <p className="mb-2">
                            '효도 청약' (이하 '회사')은(는) 이용자의 개인정보를 중요시하며, "개인정보 보호법"을 준수하고 있습니다.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                            <p className="font-semibold mb-2">수집 및 이용 안내</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>본 서비스는 <strong>별도의 회원가입 없이</strong> 이용 가능합니다.</li>
                                <li>이용자의 이름, 전화번호, 주민등록번호 등 민감한 개인정보를 서버에 저장하지 않습니다.</li>
                                <li>서비스 이용 과정에서 접속 로그, 쿠키, 접속 IP 정보 등이 통계 분석(Google Analytics) 목적으로 자동 생성되어 수집될 수 있습니다.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-900">2. 서비스 이용약관</h2>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                            <p className="mb-2">
                                <strong>제1조 (목적)</strong><br />
                                본 약관은 '효도 청약'이 제공하는 공모주 정보 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다.
                            </p>
                            <p className="mb-2">
                                <strong>제2조 (책임의 한계)</strong><br />
                                본 서비스에서 제공하는 정보(경쟁률, 일정, 확약률 등)는 금융 감독원의 전자공시 시스템 및 증권사 공시를 기반으로 가공된 정보이며, 단순 참고용입니다.<br />
                                정보의 오류나 지연이 발생할 수 있으며, <strong>투자의 최종 책임은 투자자 본인에게 있습니다.</strong> 본 서비스는 특정 종목의 매수/매도를 권유하지 않습니다.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-900">3. 광고 및 제휴 링크 고지</h2>
                        <p>
                            본 서비스 페이지에는 구글 애드센스 광고 및 제휴 마케팅 링크(쿠팡 파트너스, 증권사 제휴 등)가 포함될 수 있습니다.
                            사용자가 해당 링크를 클릭하거나 구매를 진행할 경우, 운영자에게 소정의 수수료가 지급될 수 있으며 이는 서비스 운영비로 사용됩니다.
                        </p>
                    </section>

                    <div className="mt-12 pt-6 border-t text-xs text-gray-500">
                        <p>시행일자: 2025년 11월 21일</p>
                        <p>문의: seunghwani075@gmail.com (이메일)</p>
                    </div>

                </div>
            </div>
        </div>
    )
}