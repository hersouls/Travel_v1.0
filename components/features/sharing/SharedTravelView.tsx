'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  MapPin,
  User,
  Users,
  Clock,
  Navigation,
  Share2,
  Heart,
  Eye,
} from 'lucide-react';
import { formatKoreanDate, calculateTravelDuration } from '@/lib/utils';

interface TravelPlan {
  id: string;
  title: string;
  description: string | null;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  travel_type: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  travel_days: TravelDay[];
}

interface TravelDay {
  id: string;
  day_number: number;
  date: string;
  title: string | null;
  day_plans: DayPlan[];
}

interface DayPlan {
  id: string;
  time: string | null;
  activity: string;
  location: string | null;
  notes: string | null;
  estimated_cost: number | null;
  latitude: number | null;
  longitude: number | null;
}

interface Collaborator {
  id: string;
  email: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted';
}

interface SharedTravelViewProps {
  travel: TravelPlan;
  collaborators: Collaborator[];
}

export function SharedTravelView({
  travel,
  collaborators,
}: SharedTravelViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isLiked, setIsLiked] = useState(false);

  const duration = calculateTravelDuration(travel.start_date, travel.end_date);
  const currentDay = travel.travel_days.find(
    (day) => day.day_number === selectedDay
  );
  const acceptedCollaborators = collaborators.filter(
    (c) => c.status === 'accepted'
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: travel.title,
          text: travel.description || `${travel.destination}으로의 특별한 여행`,
          url: window.location.href,
        });
      } catch {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다!');
      } catch (error) {
        console.error('Share fallback error:', error);
      }
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality with backend
  };

  const getTravelTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      beach: 'bg-cyan-100 text-cyan-800',
      mountain: 'bg-emerald-100 text-emerald-800',
      city: 'bg-indigo-100 text-indigo-800',
      culture: 'bg-purple-100 text-purple-800',
      food: 'bg-amber-100 text-amber-800',
      shopping: 'bg-pink-100 text-pink-800',
      adventure: 'bg-orange-100 text-orange-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTravelTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      beach: '해변',
      mountain: '산/자연',
      city: '도시',
      culture: '문화',
      food: '음식',
      shopping: '쇼핑',
      adventure: '모험',
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      {/* Header */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 tracking-korean-normal">
                {travel.title}
              </h1>
              <Badge className={getTravelTypeColor(travel.travel_type)}>
                {getTravelTypeLabel(travel.travel_type)}
              </Badge>
            </div>

            {travel.description && (
              <p className="mb-4 text-lg text-gray-600 break-keep-ko">
                {travel.description}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="tracking-korean-normal">
                  {travel.destination}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatKoreanDate(travel.start_date)} ~{' '}
                  {formatKoreanDate(travel.end_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 ${isLiked ? 'border-red-200 text-red-600' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? '좋아함' : '좋아요'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              공유
            </Button>
          </div>
        </div>

        {/* Creator and Collaborators */}
        <div className="flex items-center gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {travel.profiles?.full_name || '여행자'}님이 계획함
            </span>
          </div>

          {acceptedCollaborators.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {acceptedCollaborators.length}명과 함께
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">
              {formatKoreanDate(travel.created_at)}에 공유됨
            </span>
          </div>
        </div>
      </div>

      {/* Travel Itinerary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Days Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="mb-3 font-semibold tracking-korean-normal">일정</h3>
            <div className="space-y-2">
              {travel.travel_days
                .sort((a, b) => a.day_number - b.day_number)
                .map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day.day_number)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      selectedDay === day.day_number
                        ? 'border border-blue-200 bg-blue-100 text-blue-800'
                        : 'border border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium tracking-korean-normal">
                      Day {day.day_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatKoreanDate(day.date)}
                    </div>
                    {day.title && (
                      <div className="mt-1 text-sm text-gray-600 break-keep-ko">
                        {day.title}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </Card>
        </div>

        {/* Day Details */}
        <div className="lg:col-span-3">
          {currentDay ? (
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold tracking-korean-normal">
                  Day {currentDay.day_number}
                </h3>
                <div className="mb-2 text-gray-600">
                  {formatKoreanDate(currentDay.date)}
                </div>
                {currentDay.title && (
                  <p className="text-gray-700 break-keep-ko">
                    {currentDay.title}
                  </p>
                )}
              </div>

              {currentDay.day_plans.length > 0 ? (
                <div className="space-y-4">
                  {currentDay.day_plans
                    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="flex gap-4 rounded-lg bg-gray-50 p-4"
                      >
                        <div className="w-16 flex-shrink-0">
                          {plan.time && (
                            <div className="text-sm font-medium text-gray-700">
                              {plan.time}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="mb-2 font-medium text-gray-900 tracking-korean-normal">
                            {plan.activity}
                          </h4>

                          {plan.location && (
                            <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              {plan.location}
                            </div>
                          )}

                          {plan.notes && (
                            <p className="mb-2 text-sm text-gray-600 break-keep-ko">
                              {plan.notes}
                            </p>
                          )}

                          {plan.estimated_cost && (
                            <div className="text-sm text-gray-500">
                              예상 비용:{' '}
                              {plan.estimated_cost.toLocaleString('ko-KR')}원
                            </div>
                          )}
                        </div>

                        {plan.latitude && plan.longitude && (
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const url = `https://www.google.com/maps?q=${plan.latitude},${plan.longitude}`;
                                window.open(url, '_blank');
                              }}
                              className="flex items-center gap-2"
                            >
                              <Navigation className="h-4 w-4" />
                              지도
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <div className="tracking-korean-normal">
                    이 날의 계획이 아직 없습니다
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8 text-center text-gray-500">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <div className="tracking-korean-normal">일정을 선택해주세요</div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-8 text-center">
        <p className="mb-4 text-sm text-gray-500 break-keep-ko">
          이 여행 계획이 마음에 드시나요? 나만의 여행 계획을 만들어보세요!
        </p>
        <Link href="/">
          <Button className="tracking-korean-normal">
            Moonwave Travel 시작하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
