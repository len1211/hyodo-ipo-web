import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { adminDb } from '@/app/firebase-admin'

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: { scope: "profile_nickname profile_image account_email" },
      },
    }),
  ],
  
  adapter: FirestoreAdapter(adminDb), 
  
  callbacks: {
    // 1. JWT 토큰 생성 (Adapter가 User ID를 token에 저장)
    async jwt({ token, user }) {
      if (user) {
        // user.id(카카오 고유 ID)를 token의 고유 속성(id)에 저장합니다.
        token.id = user.id; 
      }
      return token;
    },
    // 2. 세션 정보 생성/요청 시 (⭐ [핵심 수정]: 토큰 안정 검사)
    async session({ session, token }) {
      // 🚨 안전장치: token이 유효하고 token.id가 있을 때만 할당합니다.
      if (session.user && token && token.id) { 
        (session.user as any).id = token.id as string;
        session.user.email = token.email; 
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }