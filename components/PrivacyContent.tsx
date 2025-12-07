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

                <div className="space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">

                    {/* 1. 개인정보처리방침 */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">Update</span>
                            1. 개인정보처리방침
                        </h2>
                        <p className="mb-4">
                            '효도 청약' (이하 '서비스')은(는) 이용자의 개인정보를 중요시하며, "개인정보 보호법" 등 관련 법령을 준수하고 있습니다.
                        </p>

                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-6">
                            
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">[수집하는 개인정보 항목 및 이용 목적]</h3>
                                <p className="mb-2 text-sm text-gray-600">본 서비스는 원활한 기능 제공을 위해 최소한의 정보를 수집 및 저장합니다.</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong>회원가입 및 식별:</strong> 카카오 간편 로그인을 통해 제공받는 <span className="underline decoration-blue-200 decoration-2">회원 식별자(ID), 닉네임, 프로필 사진</span>을 수집합니다. (비밀번호, 주민등록번호 등 민감정보는 절대 수집하지 않습니다.)
                                    </li>
                                    <li>
                                        <strong>서비스 이용 기록:</strong> 이용자가 직접 입력한 <span className="underline decoration-blue-200 decoration-2">공모주 수익 내역(종목명, 금액, 날짜)</span>과 <span className="underline decoration-blue-200 decoration-2">가족/지인 연결 정보(초대자 ID)</span>를 데이터베이스(Firebase)에 저장하여 관리 기능을 제공합니다.
                                    </li>
                                    <li>
                                        <strong>자동 수집:</strong> 서비스 안정성 및 통계 분석(Google Analytics)을 위해 접속 로그, 쿠키(Cookie), 접속 IP 정보 등이 자동 수집될 수 있습니다.
                                    </li>
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-bold text-gray-900 mb-2">[개인정보의 보유 및 파기]</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>이용자의 개인정보는 <strong>회원 탈퇴 시까지 보유</strong>하며, 탈퇴 요청 시 지체 없이 파기합니다.</li>
                                    <li>단, 관계 법령에 의해 보존할 필요가 있는 경우는 예외로 합니다.</li>
                                </ul>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-bold text-gray-900 mb-2">[개인정보의 제3자 제공]</h3>
                                <p className="mb-2">서비스는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 아래의 경우는 예외로 합니다.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong>Kakao:</strong> 카카오 로그인 및 알림/공유 기능 활용</li>
                                    <li><strong>Google:</strong> 접속 통계 분석(Analytics) 및 광고 게재(AdSense)</li>
                                </ul>
                            </div>

                        </div>
                    </section>

                    {/* 2. 서비스 이용약관 */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">2. 서비스 이용약관</h2>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                            <div>
                                <strong>제1조 (목적)</strong>
                                <p className="mt-1">
                                    본 약관은 '효도 청약'이 제공하는 공모주 정보 및 수익 관리 서비스의 이용 조건 및 절차를 규정함을 목적으로 합니다.
                                </p>
                            </div>
                            
                            <div>
                                <strong>제2조 (책임의 한계)</strong>
                                <ul className="list-decimal pl-5 mt-2 space-y-2">
                                    <li>본 서비스에서 제공하는 정보(경쟁률, 일정, 확약률 등)는 금융 감독원 및 증권사 공시를 기반으로 가공된 정보이며, 단순 참고용입니다. 정보의 오류나 지연이 발생할 수 있습니다.</li>
                                    <li>
                                        <strong className="text-red-600">투자의 최종 책임은 투자자 본인에게 있습니다.</strong> 본 서비스는 특정 종목의 매수/매도를 절대 권유하지 않으며, 투자 결과에 대한 법적 책임을 지지 않습니다.
                                    </li>
                                    <li>이용자가 입력한 '수익 기록' 데이터의 정확성에 대한 책임은 이용자 본인에게 있습니다.</li>
                                </ul>
                            </div>

                            <div>
                                <strong>제3조 (서비스의 변경)</strong>
                                <p className="mt-1">
                                    본 서비스는 무료로 제공되며, 운영상 필요에 따라 회원가입 기능, 수익 관리 기능 등의 일부가 변경되거나 중단될 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. 광고 및 제휴 고지 */}
                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-900">3. 광고 및 제휴 링크 고지</h2>
                        <p className="bg-yellow-50 p-4 rounded-lg text-yellow-800 border border-yellow-100">
                            본 서비스 페이지에는 구글 애드센스 광고 및 제휴 마케팅 링크(쿠팡 파트너스, 증권사 제휴 등)가 포함될 수 있습니다.
                            사용자가 해당 링크를 클릭하거나 구매를 진행할 경우, 운영자에게 소정의 수수료가 지급될 수 있으며 이는 서버 유지 및 서비스 운영비로 사용됩니다.
                        </p>
                    </section>

                    {/* Footer Info */}
                    <div className="mt-12 pt-6 border-t text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                        <p><strong>시행일자:</strong> 2025년 12월 08일</p>
                        <p><strong>개인정보 관리 책임자 및 문의:</strong> seunghwani075@gmail.com</p>
                    </div>

                </div>
            </div>
        </div>
    )
}