// hooks/useIpoDetail.ts
import { useState, useEffect } from 'react'
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/app/firebase"
import { storage } from '@/utils/storage'
import { FirebaseIPO } from '@/types/ipo'

export const useIpoDetail = (id: string) => {
    const [data, setData] = useState<FirebaseIPO | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!id) return;

        const fetchDoc = async () => {
            try {
                const targetName = decodeURIComponent(id);

                // 1. 캐시 먼저 확인 (Cache First Strategy)
                const RAW_CACHE_KEY = 'ipo_raw_cache';
                const cachedRawList = storage.get<FirebaseIPO[]>(RAW_CACHE_KEY);

                if (cachedRawList) {
                    const found = cachedRawList.find(item => item.stockName === targetName);
                    if (found) {
                        console.log(`✅ Hook: 캐시 데이터 사용 (${targetName})`);
                        setData(found);
                        setIsLoading(false);
                        return;
                    }
                }

                // 2. 캐시 없으면 DB 조회
                console.log(`🔥 Hook: DB 조회 발생 (${targetName})`);
                const docRef = doc(db, "ipo_list", targetName);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data() as FirebaseIPO);
                } else {
                    console.error("문서를 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoc();
    }, [id]);

    return { data, isLoading };
}