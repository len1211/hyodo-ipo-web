import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          // 이메일을 '요청'은 하되, 사용자가 거부하면 없는 채로 로그인됩니다.
          scope: "profile_nickname profile_image account_email", 
        },
      },
    }),
  ],
  callbacks: {
    // 1. 로그인 성공 시 JWT 토큰 생성 (서버 저장소)
    async jwt({ token, user, account }) {
      if (user) {
        // ⭐ [핵심] 변하지 않는 고유 ID 저장
        token.id = user.id; 
        token.provider = account?.provider;
      }
      return token;
    },
    // 2. 프론트엔드에서 useSession으로 정보 달라고 할 때 (클라이언트 전달)
    async session({ session, token }) {
      if (session.user) {
        // 세션 ID를 카카오 고유 ID로 덮어쓰기 (가장 중요!)
        (session.user as any).id = token.id as string;
        // 이메일은 있으면 넣고, 없으면(사용자가 거부했으면) null
        session.user.email = token.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }