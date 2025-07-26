import Link from 'next/link';
import { MapIcon, CalendarDaysIcon, UsersIcon, StarIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <MapIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-korean-tight">
                Moonwave Travel
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/travels"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                여행 관리
              </Link>
              <Link
                href="/map"
                className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                지도
              </Link>
              <Link
                href="/signin"
                className="btn btn-primary px-4 py-2"
              >
                시작하기
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main>
        {/* 히어로 섹션 */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-korean-tight break-keep-ko">
                스마트한 여행 계획, <br />
                <span className="text-primary-600">Moonwave</span>와 함께
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 break-keep-ko tracking-korean-normal">
                복잡한 여행 계획을 단순하게, 협업을 쉽게. <br />
                실시간 지도와 일정 관리로 완벽한 여행을 만들어보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/travels/new"
                  className="btn btn-primary px-8 py-3 text-base"
                >
                  여행 계획 시작하기
                </Link>
                <Link
                  href="/demo"
                  className="btn btn-outline px-8 py-3 text-base"
                >
                  데모 보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 기능 섹션 */}
        <section className="py-20 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 tracking-korean-tight">
                여행이 더 쉬워지는 핵심 기능
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 기능 1: 실시간 계획 관리 */}
                <div className="@container">
                  <div className="card card-hover p-6 h-full">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <CalendarDaysIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-korean-tight">
                      실시간 계획 관리
                    </h4>
                    <p className="text-gray-600 break-keep-ko tracking-korean-normal">
                      Day별로 체계적인 일정 관리. 실시간 동기화로 언제 어디서나 최신 계획을 확인하세요.
                    </p>
                  </div>
                </div>

                {/* 기능 2: Google Maps 통합 */}
                <div className="@container">
                  <div className="card card-hover p-6 h-full">
                    <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                      <MapIcon className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-korean-tight">
                      Google Maps 통합
                    </h4>
                    <p className="text-gray-600 break-keep-ko tracking-korean-normal">
                      장소 검색부터 경로 안내까지. Google Maps API로 정확하고 편리한 지도 서비스를 제공합니다.
                    </p>
                  </div>
                </div>

                {/* 기능 3: 협업 기능 */}
                <div className="@container">
                  <div className="card card-hover p-6 h-full">
                    <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                      <UsersIcon className="w-6 h-6 text-success-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3 tracking-korean-tight">
                      실시간 협업
                    </h4>
                    <p className="text-gray-600 break-keep-ko tracking-korean-normal">
                      가족, 친구와 함께 계획하세요. 실시간 공유와 편집으로 모두가 만족하는 여행을 만들어보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-12 tracking-korean-tight">
                신뢰할 수 있는 여행 파트너
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2 text-numeric">
                    1,000+
                  </div>
                  <div className="text-gray-600 tracking-korean-normal">
                    활성 사용자
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-secondary-600 mb-2 text-numeric">
                    5,000+
                  </div>
                  <div className="text-gray-600 tracking-korean-normal">
                    생성된 여행 계획
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-success-600 mb-2 text-numeric">
                    15,000+
                  </div>
                  <div className="text-gray-600 tracking-korean-normal">
                    방문한 장소
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-warning-600 mb-2 flex items-center justify-center gap-1">
                    <StarIcon className="w-6 h-6 fill-current" />
                    4.8
                  </div>
                  <div className="text-gray-600 tracking-korean-normal">
                    평균 만족도
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <MapIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-korean-tight">
                    Moonwave Travel
                  </span>
                </div>
                <p className="text-gray-400 mb-4 break-keep-ko tracking-korean-normal">
                  스마트한 여행 계획 시스템으로 더 나은 여행 경험을 제공합니다.
                </p>
                <div className="text-sm text-gray-500">
                  © 2025 Moonwave. All rights reserved.
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4 tracking-korean-tight">
                  서비스
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/travels" className="hover:text-white transition-colors">
                      여행 관리
                    </Link>
                  </li>
                  <li>
                    <Link href="/map" className="hover:text-white transition-colors">
                      지도 서비스
                    </Link>
                  </li>
                  <li>
                    <Link href="/collaboration" className="hover:text-white transition-colors">
                      협업 기능
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4 tracking-korean-tight">
                  지원
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/help" className="hover:text-white transition-colors">
                      도움말
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      문의하기
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-white transition-colors">
                      개인정보처리방침
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}