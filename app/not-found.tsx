import Link from 'next/link';
import { MapIcon, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <MapIcon className="h-10 w-10 text-gray-400" />
        </div>

        <h1 className="mb-4 font-pretendard text-6xl font-bold text-gray-900 text-numeric">
          404
        </h1>

        <h2 className="mb-4 font-pretendard text-2xl font-bold text-gray-900 tracking-korean-tight">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="mb-8 text-gray-600 tracking-korean-normal break-keep-ko">
          요청하신 페이지가 존재하지 않거나 <br />
          이동되었을 수 있습니다.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              홈으로 돌아가기
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/travels">여행 관리</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
