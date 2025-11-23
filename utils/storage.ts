// 캐시 데이터 타입 정의 (저장할 때 시간표를 붙임)
type CacheItem<T> = {
    value: T;
    timestamp: number;
  };
  
  // 기본 유효기간: 1시간 (3600000ms)
  const DEFAULT_TTL = 60 * 60 * 1000; 
  
  export const storage = {
    /**
     * 데이터 저장하기 (set)
     * @param key 저장할 키 이름
     * @param value 저장할 데이터 (어떤 타입이든 OK)
     */
    set: <T>(key: string, value: T) => {
      try {
        const item: CacheItem<T> = {
          value,
          timestamp: new Date().getTime(),
        };
        // 객체를 문자열로 바꿔서 저장
        sessionStorage.setItem(key, JSON.stringify(item));
      } catch (error) {
        console.error("스토리지 저장 실패:", error);
      }
    },
  
    /**
     * 데이터 가져오기 (get)
     * @param key 가져올 키 이름
     * @param ttl 유효기간 (밀리초, 기본값 1시간)
     * @returns 유효하면 데이터, 만료되거나 없으면 null
     */
    get: <T>(key: string, ttl: number = DEFAULT_TTL): T | null => {
      try {
        const itemStr = sessionStorage.getItem(key);
        if (!itemStr) return null;
  
        const item: CacheItem<T> = JSON.parse(itemStr);
        const now = new Date().getTime();
  
        // 유효기간이 지났는지 검사
        if (now - item.timestamp > ttl) {
          console.log(`🗑️ 캐시 만료됨: ${key}`);
          sessionStorage.removeItem(key); // 만료된 건 지워버림
          return null;
        }
  
        console.log(`✅ 캐시 적중: ${key}`);
        return item.value;
      } catch (error) {
        return null;
      }
    },
  
    /**
     * 특정 키 삭제
     */
    remove: (key: string) => {
      sessionStorage.removeItem(key);
    },
  };