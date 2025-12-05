// src/app/ipo/[id]/loading.tsx

export default function Loading() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          {/* 로딩 스피너 애니메이션 */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg font-semibold text-gray-700 animate-pulse">
            효도비서가 데이터를 분석 중입니다... 🚀
          </p>
        </div>
      </div>
    )
  }