import Link from 'next/link'

export default function AccessibilitySkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <Link 
        href="#main-content"
        className="fixed top-4 left-4 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all"
      >
        메인 콘텐츠로 건너뛰기
      </Link>
      <Link 
        href="#navigation"
        className="fixed top-4 left-36 z-50 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all"
      >
        네비게이션으로 건너뛰기
      </Link>
    </div>
  )
}