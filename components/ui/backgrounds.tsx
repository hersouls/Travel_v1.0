import React from 'react';
import { cn } from '@/lib/utils';

// Type definitions
export interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'moonwave' | 'sunset' | 'ocean' | 'forest' | 'purple';
  className?: string;
}

export interface WaveEffectProps {
  variant?: 'single' | 'double' | 'triple';
  color?: string;
  opacity?: number[];
  height?: number;
  className?: string;
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'dark';
  className?: string;
  onClick?: () => void;
}

export interface HeaderBackgroundProps {
  children: React.ReactNode;
  gradientVariant?: 'moonwave' | 'sunset' | 'ocean' | 'forest' | 'purple';
  waveVariant?: 'single' | 'double' | 'triple';
  waveColor?: string;
  waveOpacity?: number[];
  className?: string;
}

// 1. 그라디언트 배경 컴포넌트
export const GradientBackground = ({
  children,
  variant = 'moonwave',
  className = '',
}: GradientBackgroundProps) => {
  const gradients = {
    moonwave: 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700',
    sunset: 'bg-gradient-to-b from-orange-900 via-red-800 to-pink-700',
    ocean: 'bg-gradient-to-b from-teal-900 via-cyan-800 to-blue-700',
    forest: 'bg-gradient-to-b from-green-900 via-emerald-800 to-teal-700',
    purple: 'bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-700',
  };

  return (
    <div className={cn('min-h-screen', gradients[variant], className)}>
      {children}
    </div>
  );
};

// 2. SVG 웨이브 효과 컴포넌트
export const WaveEffect = ({
  variant = 'double',
  color = 'white',
  opacity = [0.1, 0.15],
  height = 60,
  className = '',
}: WaveEffectProps) => {
  const renderWaves = () => {
    switch (variant) {
      case 'single':
        return (
          <path
            d="M0,20 C100,0 200,40 375,25 L375,60 L0,60 Z"
            fill={color}
            fillOpacity={opacity[0] || 0.1}
          />
        );

      case 'double':
        return (
          <>
            <path
              d="M0,20 C100,0 200,40 375,25 L375,60 L0,60 Z"
              fill={color}
              fillOpacity={opacity[0] || 0.1}
            />
            <path
              d="M0,35 C150,15 250,50 375,30 L375,60 L0,60 Z"
              fill={color}
              fillOpacity={opacity[1] || 0.15}
            />
          </>
        );

      case 'triple':
        return (
          <>
            <path
              d="M0,10 C100,-5 200,30 375,15 L375,60 L0,60 Z"
              fill={color}
              fillOpacity={opacity[0] || 0.08}
            />
            <path
              d="M0,25 C100,5 200,45 375,30 L375,60 L0,60 Z"
              fill={color}
              fillOpacity={opacity[1] || 0.12}
            />
            <path
              d="M0,40 C150,20 250,55 375,35 L375,60 L0,60 Z"
              fill={color}
              fillOpacity={opacity[2] || 0.16}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('absolute bottom-0 left-0 right-0', className)}>
      <svg
        viewBox={`0 0 375 ${height}`}
        className="w-full"
        style={{ height: `${height}px` }}
      >
        {renderWaves()}
      </svg>
    </div>
  );
};

// 3. 글래스모피즘 버튼/카드 컴포넌트
export const GlassCard = ({
  children,
  variant = 'light',
  className = '',
  onClick,
  ...props
}: GlassCardProps) => {
  const glassStyles = {
    light: 'bg-white/10 backdrop-blur-sm border border-white/20',
    medium: 'bg-white/20 backdrop-blur-md border border-white/30',
    dark: 'bg-white/30 backdrop-blur-lg border border-white/40',
  };

  return (
    <div
      className={cn(
        glassStyles[variant],
        'rounded-lg transition-all duration-200',
        'hover:scale-105 hover:bg-white/40 hover:shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// 4. 완전한 헤더 배경 컴포넌트 (그라디언트 + 웨이브)
export const HeaderBackground = ({
  children,
  gradientVariant = 'moonwave',
  waveVariant = 'double',
  waveColor = 'white',
  waveOpacity = [0.1, 0.15],
  className = '',
}: HeaderBackgroundProps) => {
  const gradients = {
    moonwave: 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700',
    sunset: 'bg-gradient-to-b from-orange-900 via-red-800 to-pink-700',
    ocean: 'bg-gradient-to-b from-teal-900 via-cyan-800 to-blue-700',
    forest: 'bg-gradient-to-b from-green-900 via-emerald-800 to-teal-700',
    purple: 'bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-700',
  };

  return (
    <div className={cn('relative', gradients[gradientVariant], className)}>
      {children}
      <WaveEffect
        variant={waveVariant}
        color={waveColor}
        opacity={waveOpacity}
      />
    </div>
  );
};

// 5. Tailwind CSS 그라디언트 클래스 모음
export const GRADIENT_CLASSES = {
  // 세로 그라디언트
  moonwave: 'bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700',
  sunset: 'bg-gradient-to-b from-orange-900 via-red-800 to-pink-700',
  ocean: 'bg-gradient-to-b from-teal-900 via-cyan-800 to-blue-700',
  forest: 'bg-gradient-to-b from-green-900 via-emerald-800 to-teal-700',
  purple: 'bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-700',

  // 대각선 그라디언트
  moonwaveDiagonal: 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700',
  sunsetDiagonal: 'bg-gradient-to-br from-orange-900 via-red-800 to-pink-700',

  // 가로 그라디언트
  moonwaveHorizontal: 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700',
  sunsetHorizontal: 'bg-gradient-to-r from-orange-900 via-red-800 to-pink-700',

  // 버튼용 작은 그라디언트
  buttonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600',
  buttonSuccess: 'bg-gradient-to-r from-green-600 to-teal-600',
  buttonWarning: 'bg-gradient-to-r from-yellow-600 to-orange-600',
  buttonDanger: 'bg-gradient-to-r from-red-600 to-pink-600',
} as const;

// 6. 글래스모피즘 클래스 모음
export const GLASS_CLASSES = {
  light: 'bg-white/10 backdrop-blur-sm border border-white/20',
  medium: 'bg-white/20 backdrop-blur-md border border-white/30',
  dark: 'bg-white/30 backdrop-blur-lg border border-white/40',

  // 버튼용
  buttonLight:
    'bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/20',
  buttonMedium:
    'bg-white/30 hover:bg-white/50 backdrop-blur-md border border-white/30',

  // 카드용
  cardLight: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
  cardMedium: 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl',
} as const;

// 7. 사용 예시
export const ExampleUsage = () => {
  return (
    <>
      {/* 예시 1: 기본 그라디언트 배경 */}
      <GradientBackground variant="moonwave">
        <div className="p-8">
          <h1 className="text-4xl text-white">Moonwave App</h1>
        </div>
      </GradientBackground>

      {/* 예시 2: 헤더 배경 (그라디언트 + 웨이브) */}
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
      </HeaderBackground>

      {/* 예시 3: 클래스만 사용 */}
      <div className={GRADIENT_CLASSES.moonwave}>
        <div className={GLASS_CLASSES.cardMedium}>
          <p>직접 클래스 사용</p>
        </div>
      </div>

      {/* 예시 4: 독립적인 웨이브 효과 */}
      <div className="relative h-32 bg-blue-600">
        <p className="p-4 text-white">Content with wave at bottom</p>
        <WaveEffect variant="triple" color="white" opacity={[0.1, 0.15, 0.2]} />
      </div>
    </>
  );
};

// 8. CSS 커스텀 스타일 (필요한 경우)
export const CUSTOM_STYLES = `
/* 웨이브 애니메이션 추가 */
@keyframes wave {
  0%, 100% { transform: translateX(0px); }
  50% { transform: translateX(10px); }
}

.wave-animate {
  animation: wave 3s ease-in-out infinite;
}

/* 글래스 효과 향상 */
.glass-enhanced {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* 그라디언트 텍스트 */
.gradient-text {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;

const BackgroundComponents = {
  GradientBackground,
  WaveEffect,
  GlassCard,
  HeaderBackground,
  GRADIENT_CLASSES,
  GLASS_CLASSES,
  ExampleUsage,
};
