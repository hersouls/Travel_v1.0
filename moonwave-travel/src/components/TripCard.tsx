import React from 'react';
import Image from 'next/image';
import { Trip } from '@/types';
import { formatDate, calculateTripDuration } from '@/utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Calendar, Clock, Plus } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  showPlansCount?: boolean;
  isCreateCard?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onClick, 
  showPlansCount = true,
  isCreateCard = false
}) => {
  if (isCreateCard) {
    return (
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-natural-strong hover:scale-[1.02] border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50/50 golden-card natural-card',
          onClick && 'hover:bg-primary-50'
        )}
        onClick={onClick}
      >
        <div className="aspect-[1.618] relative overflow-hidden rounded-natural-large flex items-center justify-center">
          <div className="text-center golden-spacing-medium">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-natural-medium flex items-center justify-center animate-natural-spring">
              <Plus className="w-8 h-8 text-primary-500" />
            </div>
            <p className="golden-text-title font-semibold text-primary-700">새로운 여행</p>
            <p className="golden-text-body text-primary-500 mt-1">여행을 시작해보세요</p>
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
        'cursor-pointer transition-all duration-300 hover:shadow-natural-strong hover:scale-[1.02] group golden-card natural-card',
        onClick && 'hover:border-primary-300'
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-[1.618] relative overflow-hidden rounded-natural-large">
          {trip.cover_image ? (
            <Image
              src={trip.cover_image}
              alt={trip.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">🌍</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-natural-medium font-medium">
            {trip.country}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="golden-text-title line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {trip.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center golden-text-body text-secondary-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span className="font-medium">{trip.country}</span>
          </div>
          
          <div className="flex items-center golden-text-body text-secondary-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
          </div>
          
          <div className="flex items-center golden-text-body text-secondary-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
            <span className="font-medium">{duration}일</span>
          </div>
          
          {showPlansCount && (
            <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
              <span className="golden-text-body text-secondary-500 font-medium">
                계획 {plansCount}개
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(plansCount, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-primary-400 rounded-natural-small"
                  />
                ))}
                {plansCount > 5 && (
                  <span className="text-xs text-secondary-400 font-medium">+{plansCount - 5}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;