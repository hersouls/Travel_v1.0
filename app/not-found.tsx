import Link from 'next/link';
import { MapIcon, HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapIcon className="w-10 h-10 text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4 font-pretendard text-numeric">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-pretendard tracking-korean-tight">
          페이지를 찾을 수 없습니다
        </h2>
        
        <p className="text-gray-600 mb-8 break-keep-ko tracking-korean-normal">
          요청하신 페이지가 존재하지 않거나 <br />
          이동되었을 수 있습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn btn-primary px-6 py-3 gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          
          <Link
            href="/travels"
            className="btn btn-outline px-6 py-3"
          >
            여행 관리
          </Link>
        </div>
      </div>
    </div>
  );
}