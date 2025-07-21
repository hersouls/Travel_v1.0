import React from 'react';
import Image from 'next/image';
import { Trip } from '@/types';
import { formatDate, calculateTripDuration } from '@/utils/helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  showPlansCount?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onClick, 
  showPlansCount = true 
}) => {
  const duration = calculateTripDuration(trip.start_date, trip.end_date);
  const plansCount = trip.plans?.length || 0;

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
        onClick && 'hover:border-blue-300'
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          {trip.cover_image ? (
            <Image
              src={trip.cover_image}
              alt={trip.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🌍</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {trip.country}
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{trip.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{trip.country}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{duration}일</span>
          </div>
          
          {showPlansCount && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                계획 {plansCount}개
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(plansCount, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                ))}
                {plansCount > 5 && (
                  <span className="text-xs text-gray-400">+{plansCount - 5}</span>
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