'use client'

import { SessionProvider } from "next-auth/react"

// 이 컴포넌트는 앱 전체를 감싸서 로그인 정보를 공급해주는 역할을 합니다.
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}