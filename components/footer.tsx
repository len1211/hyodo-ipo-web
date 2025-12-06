import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto pb-12 md:pb-0">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between lg:px-8 gap-4">
        
        {/* 저작권 및 책임 고지 (모바일에서는 아래쪽, PC에서는 왼쪽) */}
        <div className="flex space-x-6 order-2 md:order-1">
          <p className="text-center text-xs leading-5 text-gray-400">
            &copy; 2025 효도 청약 (Hyodo-Care). All rights reserved. <br/>
            본 사이트의 정보는 투자 참고용이며, 투자의 책임은 본인에게 있습니다.
          </p>
        </div>

        {/* 링크 메뉴 (모바일에서는 위쪽, PC에서는 오른쪽) */}
        <div className="flex justify-center space-x-6 order-1 md:order-2">
          <Link href="/privacy" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
            개인정보처리방침
          </Link>
          <Link href="/guide" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
            이용가이드
          </Link>
           <a href="mailto:contact@hyodo-care.com" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
            문의하기
          </a>
        </div>
        
      </div>
    </footer>
  );
}