import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let serviceAccount: any = {};
let appInitialized = false;

// 환경 변수에서 JSON 문자열을 가져옵니다.
const keyJsonString = process.env.FIREBASE_KEY_ADMIN; 

if (keyJsonString) {
  try {
    // 1. JSON 문자열을 파싱하고 줄바꿈(\n) 문제를 복원합니다.
    serviceAccount = JSON.parse(keyJsonString);
    if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

  } catch (e) {
    console.error("FIREBASE ADMIN ERROR: Key parsing failed. Check if JSON syntax is correct.", e);
  }
}

// 2. 초기화 로직: 프로젝트 ID가 유효하고 앱이 아직 초기화되지 않았을 때만 실행
if (serviceAccount.project_id && !getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
    appInitialized = true; // 초기화 성공 플래그
  } catch (e) {
    console.error("FIREBASE ADMIN ERROR: App initialization failed.", e);
  }
} else {
  if (process.env.NODE_ENV !== 'production' && !getApps().length) {
     console.warn("FIREBASE ADMIN WARNING: Admin SDK not initialized (Missing key or already initialized).");
  }
}


let adminDb: any;
// 3. ⭐ [핵심 수정] 초기화에 성공했을 때만 getFirestore()를 호출하도록 안전장치 추가
if (appInitialized) {
    adminDb = getFirestore();
} else {
    // 초기화 실패 시 더미(dummy) 객체 할당하여 런타임 에러 방지
    console.error("FIREBASE FATAL ERROR: Admin DB access denied. Data saving will fail.");
    adminDb = { collection: () => ({ doc: () => ({ set: () => ({ then: () => ({ catch: () => {} }) }) }) }) }; 
}

// NextAuth Adapter가 DB에 접근할 때 사용할 인스턴스
export { adminDb };