import React from 'react';
import Image from 'next/image';
import { Plan } from '@/types';
import { formatTime, truncateText, getYouTubeEmbedUrl } from '@/utils/helpers';
import { planTypeConfig } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Clock, Star, ExternalLink, Play } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
  showDetails?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onClick, 
  showDetails = true 
}) => {
  const typeConfig = planTypeConfig[plan.type];
  const hasPhotos = plan.photos && plan.photos.length > 0;
  const hasYouTube = plan.youtube_url;

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md',
        onClick && 'hover:border-blue-300'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm',
              typeConfig.color
            )}>
              {typeConfig.icon}
            </div>
            <div>
              <CardTitle className="text-base line-clamp-1">{plan.place_name}</CardTitle>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  Day {plan.day}
                </span>
                <span className="mx-2">•</span>
                <span>{typeConfig.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* 시간 정보 */}
          {(plan.start_time || plan.end_time) && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>
                {plan.start_time && formatTime(plan.start_time)}
                {plan.start_time && plan.end_time && ' - '}
                {plan.end_time && formatTime(plan.end_time)}
              </span>
            </div>
          )}
          
          {/* 주소 */}
          {plan.address && (
            <div className="flex items-start text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{plan.address}</span>
            </div>
          )}
          
          {/* 평점 */}
          {plan.rating && (
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              <span>{plan.rating}</span>
            </div>
          )}
          
          {/* 사진 갤러리 */}
          {hasPhotos && (
            <div className="grid grid-cols-3 gap-2">
              {plan.photos.slice(0, 3).map((photo, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={photo}
                    alt={`${plan.place_name} 사진 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 100px"
                  />
                  {index === 2 && plan.photos.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
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
            <div className="flex items-center text-sm text-red-600 hover:text-red-700">
              <Play className="w-4 h-4 mr-2" />
              <span>YouTube 영상</span>
            </div>
          )}
          
          {/* 메모 */}
          {plan.memo && showDetails && (
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="line-clamp-3">{plan.memo}</p>
            </div>
          )}
          
          {/* 웹사이트 링크 */}
          {plan.website && showDetails && (
            <div className="flex items-center text-sm text-blue-600 hover:text-blue-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              <a 
                href={plan.website} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
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