import { cache } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { FirebaseIPO } from '@/types/ipo'

// React cache를 사용하여 중복 요청 방지
export const getIpoData = cache(async (id: string) => {
  try {
    const stockName = decodeURIComponent(id);
    const docRef = doc(db, "ipo_list", stockName);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();

    // ⭐ 데이터를 FirebaseIPO 타입으로 단언(Assertion)하여 반환
    return {
        ...data,
        stockName: data.stockName || stockName,
      } as FirebaseIPO;
  } catch (error) {
    console.error("데이터 가져오기 실패:", error);
    return null;
  }
});