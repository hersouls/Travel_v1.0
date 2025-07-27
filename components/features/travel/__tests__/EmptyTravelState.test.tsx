import { render, screen } from '@testing-library/react';
import { EmptyTravelState } from '../EmptyTravelState';

describe('EmptyTravelState', () => {
  it('renders empty state message', () => {
    render(<EmptyTravelState />);
    
    expect(screen.getByText(/아직 여행 계획이 없습니다/i)).toBeInTheDocument();
    expect(screen.getByText(/새로운 여행을 시작해보세요/i)).toBeInTheDocument();
  });

  it('renders create travel button', () => {
    render(<EmptyTravelState />);
    
    const createButton = screen.getByRole('button', { name: /새 여행 만들기/i });
    expect(createButton).toBeInTheDocument();
  });
});