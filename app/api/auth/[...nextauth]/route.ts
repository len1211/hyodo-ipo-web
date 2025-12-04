import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
// ❌ 어댑터 관련 import 삭제 (FirestoreAdapter, adminDb 등)

// ⭕ 수동 저장을 위해 db와 Firestore 함수를 가져옵니다.
// (경로는 승환님 프로젝트에 맞게 @/app/firebase 등으로 설정되어 있다고 가정합니다)
import { db } from "@/app/firebase"
import { doc, setDoc } from "firebase/firestore"

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],

  // 1. 🚨 어댑터 삭제! 
  // (이게 남아있으면 계속 랜덤 ID로 중복 생성됩니다. 과감히 지우세요.)
  // adapter: FirestoreAdapter(adminDb), 

  // 2. 세션 전략은 JWT 유지
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    // 3. ⭐ 로그인 시 실행: 여기서 카카오 회원번호(user.id)로 문서를 고정해서 만듭니다.
    async signIn({ user }) {
      try {
        if (!user.id) return false;

        // doc(db, 'users', user.id) -> 문서 ID를 카카오 ID로 강제 지정!
        // 이렇게 하면 로그인할 때마다 새 문서가 생기지 않고, 내 ID를 찾아갑니다.
        await setDoc(doc(db, 'users', user.id), {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          lastLogin: new Date().toISOString(), // 로그인 시간만 업데이트
        }, { merge: true }); // ⭐ 중요: merge: true 옵션으로 기존 데이터(목표, 수익 등)는 유지

        return true; // 로그인 성공 처리
      } catch (error) {
        console.error("DB Save Error:", error);
        return true; // 에러가 나도 로그인은 허용 (선택 사항)
      }
    },

    // 4. JWT 생성 시 실행 (토큰에 ID 심기)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
      }
      return token;
    },

    // 5. 클라이언트 세션 조회 시 실행 (세션에 ID 심기)
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }