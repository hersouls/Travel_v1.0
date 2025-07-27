import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyTravelState } from '../EmptyTravelState';

describe('EmptyTravelState', () => {
  it('기본 텍스트가 올바르게 표시되어야 함', () => {
    render(<EmptyTravelState />);

    expect(screen.getByText('첫 번째 여행을 계획해보세요')).toBeInTheDocument();
    expect(
      screen.getByText(/Moonwave Travel과 함께 특별한 여행을 계획하고/)
    ).toBeInTheDocument();
    expect(screen.getByText(/소중한 추억을 만들어보세요/)).toBeInTheDocument();
  });

  it('Pretendard 폰트 클래스가 적용되어야 함', () => {
    render(<EmptyTravelState />);

    const titleElement = screen.getByText('첫 번째 여행을 계획해보세요');
    expect(titleElement).toHaveClass('font-pretendard');
    expect(titleElement).toHaveClass('tracking-korean-tight');
  });

  it('액션 버튼들이 올바르게 표시되어야 함', () => {
    render(<EmptyTravelState />);

    expect(
      screen.getByRole('link', { name: /새 여행 만들기/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /예시 여행 보기/ })
    ).toBeInTheDocument();
  });

  it('새 여행 만들기 버튼이 올바른 링크를 가져야 함', () => {
    render(<EmptyTravelState />);

    const createButton = screen.getByRole('link', { name: /새 여행 만들기/ });
    expect(createButton).toHaveAttribute('href', '/travels/new');
  });

  it('예시 여행 보기 버튼이 올바른 링크를 가져야 함', () => {
    render(<EmptyTravelState />);

    const examplesButton = screen.getByRole('link', { name: /예시 여행 보기/ });
    expect(examplesButton).toHaveAttribute('href', '/examples');
  });

  it('특징 섹션이 올바르게 표시되어야 함', () => {
    render(<EmptyTravelState />);

    expect(screen.getByText('Moonwave Travel의 특징')).toBeInTheDocument();
  });

  it('모든 특징 항목들이 표시되어야 함', () => {
    render(<EmptyTravelState />);

    expect(screen.getByText('실시간 협업')).toBeInTheDocument();
    expect(
      screen.getByText('친구들과 함께 여행을 계획하세요')
    ).toBeInTheDocument();

    expect(screen.getByText('지도 연동')).toBeInTheDocument();
    expect(
      screen.getByText('Google Maps로 경로를 확인하세요')
    ).toBeInTheDocument();

    expect(screen.getByText('예산 관리')).toBeInTheDocument();
    expect(
      screen.getByText('여행 예산을 체계적으로 관리하세요')
    ).toBeInTheDocument();

    expect(screen.getByText('일정 공유')).toBeInTheDocument();
    expect(
      screen.getByText('여행 일정을 간편하게 공유하세요')
    ).toBeInTheDocument();
  });

  it('아이콘들이 올바르게 표시되어야 함', () => {
    render(<EmptyTravelState />);

    // MapPin과 Compass 아이콘이 메인 아이콘 영역에 있는지 확인
    const iconContainer = screen
      .getByText('첫 번째 여행을 계획해보세요')
      .closest('div')
      ?.querySelector('.bg-gradient-to-br');
    expect(iconContainer).toBeInTheDocument();
  });

  it('반응형 클래스가 적용되어야 함', () => {
    const { container } = render(<EmptyTravelState />);

    // sm:flex-row 클래스가 있는지 확인
    const buttonContainer = screen
      .getByText('새 여행 만들기')
      .closest('div')?.parentElement;
    expect(buttonContainer).toHaveClass('sm:flex-row');

    // features 섹션의 grid 클래스 확인 - 직접 선택자 사용
    const featuresGrid = container.querySelector(
      '.grid.grid-cols-1.gap-4.text-sm.sm\\:grid-cols-2'
    );
    expect(featuresGrid).toBeInTheDocument();
  });

  it('접근성 속성이 올바르게 설정되어야 함', () => {
    render(<EmptyTravelState />);

    // 제목이 h2 태그로 되어 있는지 확인
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('첫 번째 여행을 계획해보세요');

    // 특징 섹션 제목이 h3 태그로 되어 있는지 확인
    const featuresTitle = screen.getByRole('heading', { level: 3 });
    expect(featuresTitle).toHaveTextContent('Moonwave Travel의 특징');
  });

  it('한국어 텍스트 래핑이 올바르게 적용되어야 함', () => {
    const { container } = render(<EmptyTravelState />);

    // break-keep-ko 클래스가 여러 요소에 적용되어 있는지 확인
    const elementsWithBreakKeep = container.querySelectorAll('.break-keep-ko');
    expect(elementsWithBreakKeep.length).toBeGreaterThan(0);
  });

  it('Moonwave 브랜드 색상이 적용되어야 함', () => {
    const { container } = render(<EmptyTravelState />);

    // moonwave-primary 색상이 사용되는지 확인
    const primaryColorElements = container.querySelectorAll(
      '.text-moonwave-primary'
    );
    expect(primaryColorElements.length).toBeGreaterThan(0);

    // moonwave-secondary 색상이 사용되는지 확인
    const secondaryColorElements = container.querySelectorAll(
      '.text-moonwave-secondary'
    );
    expect(secondaryColorElements.length).toBeGreaterThan(0);
  });

  it('그라데이션 배경이 적용되어야 함', () => {
    const { container } = render(<EmptyTravelState />);

    // 메인 아이콘 컨테이너에 그라데이션 클래스가 있는지 확인
    const gradientContainer = container.querySelector('.bg-gradient-to-br');
    expect(gradientContainer).toBeInTheDocument();
  });
});
