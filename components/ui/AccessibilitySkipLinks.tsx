import Link from 'next/link';

export default function AccessibilitySkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <Link
        href="#main-content"
        className="bg-primary-600 focus:ring-offset-primary-600 fixed left-4 top-4 z-50 rounded-md px-4 py-2 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
      >
        메인 콘텐츠로 건너뛰기
      </Link>
      <Link
        href="#navigation"
        className="bg-primary-600 focus:ring-offset-primary-600 fixed left-36 top-4 z-50 rounded-md px-4 py-2 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
      >
        네비게이션으로 건너뛰기
      </Link>
    </div>
  );
}
