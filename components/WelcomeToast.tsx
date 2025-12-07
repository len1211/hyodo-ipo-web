'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

export default function WelcomeToast() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ stock: '', profit: 0 });

  useEffect(() => {
    // URL에서 파라미터 읽기
    const source = searchParams.get('utm_source');
    const stock = searchParams.get('stock');
    const profit = searchParams.get('profit');

    // 카카오톡 공유로 들어왔고, 데이터가 있다면
    if (source === 'kakao_share' && stock && profit) {
      setData({ stock, profit: Number(profit) });
      setIsVisible(true); // 토스트 띄우기
    }
  }, [searchParams]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* 닫기 버튼 */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* 상단 장식 */}
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 py-6 text-center">
          <span className="text-4xl">🎉</span>
        </div>

        {/* 내용 */}
        <div className="p-6 text-center">
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            가족분의 수익 소식!
          </h3>
          <p className="mb-6 text-gray-600">
            어머니/아버지께서 <br/>
            <span className="font-bold text-blue-600">{data.stock}</span> 공모주로<br/>
            <span className="text-lg font-bold text-red-500">+{data.profit.toLocaleString()}원</span>을 버셨어요!
          </p>

          <button
            onClick={() => setIsVisible(false)}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700"
          >
            축하 전화 드리기 📞
          </button>
          
          <p className="mt-4 text-xs text-gray-400">
            나도 효도청약 시작해보기 (무료)
          </p>
        </div>
      </div>
    </div>
  );
}