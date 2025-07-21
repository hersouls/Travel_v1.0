import React from 'react';
import Image from 'next/image';
import { Plan } from '@/types';
import { formatTime } from '@/utils/helpers';
import { planTypeConfig } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Clock, Star, ExternalLink, Play, Plus } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
  showDetails?: boolean;
  isCreateCard?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onClick, 
  showDetails = true,
  isCreateCard = false
}) => {
  if (isCreateCard) {
    return (
      <Card 
        className={cn(
          'cursor-pointer transition-all duration-300 hover:shadow-natural-medium border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50/50 natural-card',
          onClick && 'hover:bg-primary-50'
        )}
        onClick={onClick}
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-natural-medium flex items-center justify-center animate-natural-spring">
            <Plus className="w-6 h-6 text-primary-500" />
          </div>
          <p className="text-base font-semibold text-primary-700 golden-text-title">계획 추가</p>
          <p className="text-sm text-primary-500 mt-1 golden-text-body">새로운 장소를 추가하세요</p>
        </div>
      </Card>
    );
  }

  const typeConfig = planTypeConfig[plan.type];
  const hasPhotos = plan.photos && plan.photos.length > 0;
  const hasYouTube = plan.youtube_url;

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-natural-medium group natural-card',
        onClick && 'hover:border-primary-300'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
              <div className={cn(
                'w-10 h-10 rounded-natural-medium flex items-center justify-center text-white text-lg shadow-natural-soft',
                typeConfig.color
              )}>
                {typeConfig.icon}
              </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base line-clamp-1 group-hover:text-primary-600 transition-colors duration-200">
                {plan.place_name}
              </CardTitle>
              <div className="flex items-center text-xs text-secondary-500 mt-1 space-x-2">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-natural-medium font-medium">
                  Day {plan.day}
                </span>
                <span>•</span>
                <span className="font-medium">{typeConfig.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* 시간 정보 */}
          {(plan.start_time || plan.end_time) && (
            <div className="flex items-center text-sm text-secondary-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
              <span className="font-medium">
                {plan.start_time && formatTime(plan.start_time)}
                {plan.start_time && plan.end_time && ' - '}
                {plan.end_time && formatTime(plan.end_time)}
              </span>
            </div>
          )}
          
          {/* 주소 */}
          {plan.address && (
            <div className="flex items-start text-sm text-secondary-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary-500" />
              <span className="line-clamp-2">{plan.address}</span>
            </div>
          )}
          
          {/* 평점 */}
          {plan.rating && (
            <div className="flex items-center text-sm text-secondary-600">
              <Star className="w-4 h-4 mr-1 text-accent-500 fill-current" />
              <span className="font-medium">{plan.rating}</span>
            </div>
          )}
          
          {/* 사진 갤러리 */}
          {hasPhotos && (
            <div className="grid grid-cols-3 gap-2">
              {plan.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-natural-medium">
                  <Image
                    src={photo}
                    alt={`${plan.place_name} 사진 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 100px"
                  />
                  {index === 2 && plan.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-natural-medium">
                      <span className="text-white text-sm font-bold">
                        +{plan.photos.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* YouTube 링크 */}
          {hasYouTube && (
            <div className="flex items-center text-sm text-error-500 hover:text-error-600">
              <Play className="w-4 h-4 mr-2" />
              <span className="font-medium">YouTube 영상</span>
            </div>
          )}
          
          {/* 메모 */}
          {plan.memo && showDetails && (
            <div className="text-sm text-secondary-700 bg-secondary-50 p-4 rounded-natural-medium">
              <p className="line-clamp-3">{plan.memo}</p>
            </div>
          )}
          
          {/* 웹사이트 링크 */}
          {plan.website && showDetails && (
            <div className="flex items-center text-sm text-primary-600 hover:text-primary-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              <a 
                href={plan.website} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-medium"
              >
                웹사이트 방문
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;