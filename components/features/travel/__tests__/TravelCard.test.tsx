import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TravelCard } from '../TravelCard';
import { mockTravel } from '@/test/fixtures/travel';

// TravelCard에 필요한 타입 정의
const mockTravelWithDays = {
  ...mockTravel,
  metadata: {},
  travel_days: [
    {
      id: 'day-1',
      day_number: 1,
      date: '2025-08-15',
      title: null,
      day_plans: [
        {
          id: 'plan-1',
          place_name: '성산일출봉',
          plan_type: 'sightseeing',
          planned_time: '09:00',
        },
        {
          id: 'plan-2',
          place_name: '만장굴',
          plan_type: 'sightseeing',
          planned_time: '14:00',
        },
      ],
    },
    {
      id: 'day-2',
      day_number: 2,
      date: '2025-08-16',
      title: null,
      day_plans: [
        {
          id: 'plan-3',
          place_name: '한라산',
          plan_type: 'hiking',
          planned_time: '08:00',
        },
      ],
    },
  ],
  collaborators: [],
};

describe('TravelCard', () => {
  it('여행 정보가 올바르게 표시되어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    expect(screen.getByText('제주도 여행')).toBeInTheDocument();
    expect(screen.getByText('제주도')).toBeInTheDocument();
    expect(screen.getByText('제주도 가족 여행')).toBeInTheDocument();
  });

  it('Pretendard 폰트 클래스가 적용되어야 함', () => {
    const { container } = render(<TravelCard travel={mockTravelWithDays} />);

    expect(container.firstChild).toHaveClass('font-pretendard');
    expect(
      container.querySelector('.tracking-korean-tight')
    ).toBeInTheDocument();
  });

  it('Container Query 클래스가 적용되어야 함', () => {
    const { container } = render(<TravelCard travel={mockTravelWithDays} />);

    expect(container.firstChild).toHaveClass('@container/card');
    // Container Query 클래스가 적용되었는지 확인 (CSS 선택자 문제로 인해 다른 방법 사용)
    expect(container.firstChild).toHaveClass('@container/card');
    expect(container.innerHTML).toContain('@lg/card:flex-row');
  });

  it('날짜 정보가 올바르게 표시되어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    expect(screen.getByText(/2025년 8월 15일/)).toBeInTheDocument();
    expect(screen.getByText(/2025년 8월 20일/)).toBeInTheDocument();
  });

  it('여행 기간이 올바르게 계산되어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    // 5박 6일 (8월 15일 ~ 8월 20일)
    expect(screen.getByText('5박 6일')).toBeInTheDocument();
  });

  it('계획 개수가 올바르게 표시되어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    // 총 3개 계획 (성산일출봉, 만장굴, 한라산)
    expect(screen.getByText('3개 계획')).toBeInTheDocument();
  });

  it('상태 배지가 올바르게 표시되어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    expect(screen.getByText('계획 중')).toBeInTheDocument();
  });

  it('상태에 따른 배지 색상이 올바르게 적용되어야 함', () => {
    const { rerender } = render(<TravelCard travel={mockTravelWithDays} />);

    // planning 상태
    expect(screen.getByText('계획 중')).toHaveClass('text-blue-600');

    // ongoing 상태로 변경
    const ongoingTravel = {
      ...mockTravelWithDays,
      status: 'ongoing' as const,
      metadata: {},
    };
    rerender(<TravelCard travel={ongoingTravel} />);
    expect(screen.getByText('진행 중')).toHaveClass('text-green-600');

    // completed 상태로 변경
    const completedTravel = {
      ...mockTravelWithDays,
      status: 'completed' as const,
      metadata: {},
    };
    rerender(<TravelCard travel={completedTravel} />);
    expect(screen.getByText('완료')).toHaveClass('text-gray-600');
  });

  it('공개 여행인 경우 공개 배지가 표시되어야 함', () => {
    const publicTravel = {
      ...mockTravelWithDays,
      is_public: true,
      metadata: {},
    };
    render(<TravelCard travel={publicTravel} />);

    expect(screen.getByText('공개')).toBeInTheDocument();
  });

  it('협업자가 있는 경우 참여자 수가 표시되어야 함', () => {
    const collaborativeTravel = {
      ...mockTravelWithDays,
      collaborators: ['user-2'],
      metadata: {},
    };
    render(<TravelCard travel={collaborativeTravel} />);

    expect(screen.getByText('2명 참여')).toBeInTheDocument();
  });

  it('액션 버튼 클릭 시 드롭다운이 표시되어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    const actionButton = screen.getByRole('button');
    fireEvent.click(actionButton);

    expect(screen.getByText('수정')).toBeInTheDocument();
    expect(screen.getByText('삭제')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 onEdit 콜백이 호출되어야 함', () => {
    const onEditMock = jest.fn();
    render(<TravelCard travel={mockTravelWithDays} onEdit={onEditMock} />);

    const actionButton = screen.getByRole('button');
    fireEvent.click(actionButton);

    const editButton = screen.getByText('수정');
    fireEvent.click(editButton);

    expect(onEditMock).toHaveBeenCalledWith(mockTravelWithDays);
  });

  it('삭제 버튼 클릭 시 onDelete 콜백이 호출되어야 함', () => {
    const onDeleteMock = jest.fn();
    render(<TravelCard travel={mockTravelWithDays} onDelete={onDeleteMock} />);

    const actionButton = screen.getByRole('button');
    fireEvent.click(actionButton);

    const deleteButton = screen.getByText('삭제');
    fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledWith(mockTravelWithDays);
  });

  it('제목 클릭 시 상세 페이지로 이동하는 링크가 있어야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    const titleLink = screen.getByRole('link', { name: '제주도 여행' });
    expect(titleLink).toHaveAttribute('href', '/travels/test-travel-id');
  });

  it('자세히 보기 버튼이 올바른 링크를 가져야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    const detailLink = screen.getByRole('link', { name: '자세히 보기' });
    expect(detailLink).toHaveAttribute('href', '/travels/test-travel-id');
  });

  it('수정하기 버튼이 올바른 링크를 가져야 함', () => {
    render(<TravelCard travel={mockTravelWithDays} />);

    const editLink = screen.getByRole('link', { name: '수정하기' });
    expect(editLink).toHaveAttribute('href', '/travels/test-travel-id/edit');
  });

  it('설명이 없는 경우 설명 섹션이 표시되지 않아야 함', () => {
    const travelWithoutDescription = {
      ...mockTravelWithDays,
      description: null,
      metadata: {},
    };
    render(<TravelCard travel={travelWithoutDescription} />);

    expect(screen.queryByText('제주도 가족 여행')).not.toBeInTheDocument();
  });

  it('커스텀 className이 적용되어야 함', () => {
    const { container } = render(
      <TravelCard travel={mockTravelWithDays} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
