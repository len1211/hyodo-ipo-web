import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { adminDb } from '@/app/firebase-admin'

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  
  // 1. 어댑터 연결 (이게 있어야 로그인 시 DB에 users 컬렉션이 자동 생성됨)
  adapter: FirestoreAdapter(adminDb), 
  
  // 2. ⭐ [핵심] 전략을 'jwt'로 강제 설정 (이러면 세션 문서를 안 만듭니다)
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // 3. JWT 생성 시 실행 (로그인 직후 1번만 실행됨)
    // 어댑터가 있어도 strategy가 jwt면 이 콜백이 실행됩니다.
    async jwt({ token, user }) {
      // 로그인 초기에는 user 객체가 있습니다. (DB에 저장된 ID)
      if (user) {
        token.id = user.id; 
      }
      return token;
    },

    // 4. 클라이언트에서 useSession() 부를 때 실행
    // JWT 방식이므로 여기서는 'user' 대신 'token'을 씁니다.
    async session({ session, token }) {
      if (session.user && token && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }