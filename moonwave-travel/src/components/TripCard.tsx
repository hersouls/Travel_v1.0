import React from 'react';
import Image from 'next/image';
import { Trip } from '@/types';
import { formatDate, calculateTripDuration } from '@/utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Calendar, Clock, Plus, Star, Globe } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  showPlansCount?: boolean;
  isCreateCard?: boolean;
}

const TripCard = React.memo<TripCardProps>(({ 
  trip, 
  onClick, 
  showPlansCount = true,
  isCreateCard = false
}) => {
  if (isCreateCard) {
    return (
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50/50',
          onClick && 'hover:bg-primary-50'
        )}
        onClick={onClick}
      >
        <div className="aspect-[1.618] relative overflow-hidden rounded-t-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary-500" />
            </div>
                          <p className="font-semibold text-primary-600 text-lg">새로운 여행</p>
              <p className="text-primary-500 mt-1">여행을 시작해보세요</p>
          </div>
        </div>
      </Card>
    );
  }

  const duration = calculateTripDuration(trip.start_date, trip.end_date);
  const plansCount = trip.plans?.length || 0;

  return (
    <Card 
              className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group overflow-hidden',
          onClick && 'hover:border-primary-300'
        )}
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-[1.618] relative overflow-hidden">
          {trip.cover_image ? (
            <Image
              src={trip.cover_image}
              alt={trip.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onClick={(e) => {
                e.stopPropagation();
                // 사진 확대 보기 기능 추가 예정
                console.log('커버 이미지 확대 보기:', trip.cover_image);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Globe className="w-12 h-12 text-white" />
            </div>
          )}
          
          {/* 국가 배지 */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              {trip.country}
            </Badge>
          </div>
          
          {/* 호버 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* 즐겨찾기 버튼 */}
          <button 
            className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              // 즐겨찾기 토글 기능 추가 예정
              console.log('즐겨찾기 토글:', trip.id);
            }}
          >
            <Star className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 text-lg">
          {trip.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span className="font-medium">{trip.country}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span className="font-medium">{duration}일</span>
          </div>
          
          {showPlansCount && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-gray-500 font-medium">
                계획 {plansCount}개
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(plansCount, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary-400 rounded-full"
                  />
                ))}
                {plansCount > 5 && (
                  <span className="text-xs text-gray-400 font-medium">+{plansCount - 5}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

TripCard.displayName = 'TripCard';

export default TripCard;