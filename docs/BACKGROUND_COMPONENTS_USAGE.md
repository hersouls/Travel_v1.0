# Moonwave 배경 컴포넌트 사용 가이드

## 개요

Moonwave 스타일의 그라디언트 배경과 웨이브 효과를 제공하는 재사용 가능한 컴포넌트들입니다.

## 컴포넌트 목록

### 1. GradientBackground

기본 그라디언트 배경 컴포넌트입니다.

```tsx
import { GradientBackground } from '@/components/ui/backgrounds';

// 기본 사용법
<GradientBackground variant="moonwave">
  <div className="p-8">
    <h1 className="text-4xl text-white">Moonwave App</h1>
  </div>
</GradientBackground>;

// 사용 가능한 variants
// - moonwave: 파란색 그라디언트 (기본값)
// - sunset: 주황-빨강-핑크 그라디언트
// - ocean: 청록-시안-파랑 그라디언트
// - forest: 초록-에메랄드-청록 그라디언트
// - purple: 보라-인디고-파랑 그라디언트
```

### 2. WaveEffect

SVG 웨이브 효과 컴포넌트입니다.

```tsx
import { WaveEffect } from '@/components/ui/backgrounds';

// 기본 사용법
<div className="relative h-32 bg-blue-600">
  <p className="p-4 text-white">Content with wave at bottom</p>
  <WaveEffect variant="double" color="white" opacity={[0.1, 0.15]} />
</div>;

// 사용 가능한 variants
// - single: 단일 웨이브
// - double: 이중 웨이브 (기본값)
// - triple: 삼중 웨이브

// 속성
// - color: 웨이브 색상 (기본값: 'white')
// - opacity: 투명도 배열 (기본값: [0.1, 0.15])
// - height: 웨이브 높이 (기본값: 60)
```

### 3. GlassCard

글래스모피즘 효과 카드 컴포넌트입니다.

```tsx
import { GlassCard } from '@/components/ui/backgrounds';

// 기본 사용법
<GlassCard variant="medium" className="p-4">
  <p className="text-white">Glass card content</p>
</GlassCard>

// 사용 가능한 variants
// - light: 연한 글래스 효과
// - medium: 중간 글래스 효과 (기본값)
// - dark: 진한 글래스 효과

// 클릭 이벤트 추가
<GlassCard
  variant="medium"
  className="p-4 cursor-pointer"
  onClick={() => console.log('Card clicked!')}
>
  <p className="text-white">Clickable glass card</p>
</GlassCard>
```

### 4. HeaderBackground

그라디언트 + 웨이브 조합 헤더 배경 컴포넌트입니다.

```tsx
import { HeaderBackground } from '@/components/ui/backgrounds';

// 기본 사용법
<HeaderBackground
  gradientVariant="moonwave"
  waveVariant="double"
  className="h-64 p-8"
>
  <div className="relative z-10">
    <h1 className="mb-4 text-4xl text-white">Header Title</h1>
    <GlassCard variant="medium" className="max-w-md p-4">
      <p className="text-white">Glass card content</p>
    </GlassCard>
  </div>
</HeaderBackground>;
```

## CSS 클래스 상수

### GRADIENT_CLASSES

직접 Tailwind 클래스를 사용할 수 있습니다.

```tsx
import { GRADIENT_CLASSES } from '@/components/ui/backgrounds';

// 직접 클래스 사용
<div className={GRADIENT_CLASSES.moonwave}>
  <div className="p-8">
    <h1 className="text-white">Direct class usage</h1>
  </div>
</div>;

// 사용 가능한 클래스들
// - moonwave: 세로 그라디언트
// - moonwaveDiagonal: 대각선 그라디언트
// - moonwaveHorizontal: 가로 그라디언트
// - sunset, ocean, forest, purple: 각각의 그라디언트
// - buttonPrimary, buttonSuccess, buttonWarning, buttonDanger: 버튼용 그라디언트
```

### GLASS_CLASSES

글래스 효과 클래스들입니다.

```tsx
import { GLASS_CLASSES } from '@/components/ui/backgrounds';

// 직접 클래스 사용
<div className={GLASS_CLASSES.cardMedium}>
  <p className="text-white">Glass effect with direct class</p>
</div>;

// 사용 가능한 클래스들
// - light, medium, dark: 기본 글래스 효과
// - buttonLight, buttonMedium: 버튼용 글래스 효과
// - cardLight, cardMedium: 카드용 글래스 효과
```

## 헬퍼 함수

### 페이지별 배경 설정

```tsx
import { getPageBackground } from '@/lib/backgroundHelpers';
import { usePathname } from 'next/navigation';

function MyComponent() {
  const pathname = usePathname();
  const backgroundVariant = getPageBackground(pathname);

  return (
    <GradientBackground variant={backgroundVariant}>
      {/* 컴포넌트 내용 */}
    </GradientBackground>
  );
}
```

### 시간대별 배경

```tsx
import { getTimeBasedBackground } from '@/lib/backgroundHelpers';

function TimeBasedBackground() {
  const timeBackground = getTimeBasedBackground();

  return (
    <GradientBackground variant={timeBackground}>
      {/* 시간대에 따른 배경 */}
    </GradientBackground>
  );
}
```

## 실제 적용 예시

### 1. 메인 페이지

```tsx
// app/page.tsx
import {
  GradientBackground,
  GlassCard,
  WaveEffect,
} from '@/components/ui/backgrounds';

export default function HomePage() {
  return (
    <GradientBackground variant="moonwave" className="relative min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white">
            Moonwave Travel
          </h1>
          <p className="mb-8 text-xl text-white/90">
            스마트한 여행 계획 시스템
          </p>
        </div>

        {/* 특징 섹션 */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <GlassCard variant="medium" className="p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-white">
              스마트한 일정 관리
            </h3>
            <p className="text-white/90">AI 기반 여행 일정 최적화</p>
          </GlassCard>
          {/* 추가 카드들... */}
        </div>
      </div>

      {/* 웨이브 효과 */}
      <WaveEffect
        variant="double"
        color="white"
        opacity={[0.1, 0.15]}
        height={80}
        className="absolute bottom-0"
      />
    </GradientBackground>
  );
}
```

### 2. 네비게이션 바

```tsx
// components/features/navigation/MainNavigation.tsx
import { GLASS_CLASSES } from '@/components/ui/backgrounds';

export function MainNavigation() {
  return (
    <nav
      className={`sticky top-0 z-50 ${GLASS_CLASSES.light} border-b border-white/20`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-white">
            Moonwave Travel
          </Link>

          {/* 네비게이션 아이템들 */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/travels"
              className="rounded-md px-3 py-2 text-white/90 hover:bg-white/20 hover:text-white"
            >
              여행 관리
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 3. 사용자 메뉴

```tsx
// components/features/auth/UserMenu.tsx
import { GLASS_CLASSES } from '@/components/ui/backgrounds';

export function UserMenu() {
  return (
    <div className="relative">
      <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-white/20">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="text-sm font-medium text-white">사용자명</div>
      </button>

      {isMenuOpen && (
        <div
          className={`absolute right-0 z-50 mt-2 w-64 rounded-lg ${GLASS_CLASSES.cardMedium}`}
        >
          <div className="border-b border-white/20 p-4">
            <div className="text-sm font-medium text-white">사용자명</div>
            <div className="text-xs text-white/70">user@example.com</div>
          </div>
          {/* 메뉴 아이템들... */}
        </div>
      )}
    </div>
  );
}
```

## 성능 최적화 팁

1. **React.memo 사용**: 자주 변경되지 않는 배경 컴포넌트에 적용
2. **CSS 변수 활용**: 동적 색상 변경 시 CSS 변수 사용
3. **SVG 최적화**: 웨이브 효과의 복잡도 조절
4. **지연 로딩**: 필요할 때만 배경 컴포넌트 로드

## 접근성 고려사항

1. **대비 확인**: 텍스트와 배경 간 충분한 대비 확보
2. **포커스 표시**: 글래스 효과 버튼의 포커스 상태 명확히 표시
3. **스크린 리더**: 장식적 SVG에 `aria-hidden="true"` 추가
4. **키보드 네비게이션**: 모든 인터랙티브 요소의 키보드 접근성 보장

## 브라우저 호환성

- **backdrop-filter**: 모던 브라우저 지원 (IE 미지원)
- **CSS Grid**: IE 11+ 지원
- **CSS Variables**: IE 미지원 (폴백 제공 필요)

## 커스터마이징

### 새로운 그라디언트 추가

```tsx
// components/ui/backgrounds.tsx
const gradients = {
  // 기존 그라디언트들...
  aurora: 'bg-gradient-to-b from-green-900 via-blue-800 to-purple-700',
  sunset: 'bg-gradient-to-b from-orange-900 via-red-800 to-pink-700',
};
```

### 새로운 글래스 효과 추가

```tsx
// components/ui/backgrounds.tsx
const glassStyles = {
  // 기존 스타일들...
  ultra: 'bg-white/40 backdrop-blur-xl border border-white/50',
};
```

이 가이드를 참고하여 Moonwave 스타일의 아름다운 배경 효과를 프로젝트에 적용해보세요!
