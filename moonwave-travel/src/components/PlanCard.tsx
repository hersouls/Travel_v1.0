import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Plan } from '@/types';
import { planTypeConfig } from '@/lib/mockData';
import { formatTime } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/helpers';
import { Clock, MapPin, Star, Play } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
  showDetails?: boolean;
}

const PlanCard = React.memo<PlanCardProps>(({ 
  plan, 
  onClick, 
  showDetails = true 
}) => {
  const config = planTypeConfig[plan.type] || planTypeConfig.other;

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group overflow-hidden',
        onClick && 'hover:border-blue-300'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* 시간 및 유형 */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {plan.start_time && formatTime(plan.start_time)} - {plan.end_time && formatTime(plan.end_time)}
              </span>
            </div>
            
            <Badge 
              variant={
                config.color === 'bg-blue-500' ? 'default' :
                config.color === 'bg-green-500' ? 'secondary' :
                config.color === 'bg-orange-500' ? 'outline' :
                config.color === 'bg-purple-500' ? 'default' :
                'secondary'
              }
              className={
                config.color === 'bg-orange-500' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                config.color === 'bg-purple-500' ? 'bg-purple-100 text-purple-700' :
                ''
              }
            >
              <span className="mr-1">{config.icon}</span>
              {config.label}
            </Badge>
          </div>

          {/* 장소 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {plan.place_name}
                </h3>
                
                {showDetails && (
                  <div className="mt-2 space-y-1">
                    {plan.address && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{plan.address}</span>
                      </div>
                    )}
                    
                    {plan.rating && plan.rating > 0 && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < Math.floor(plan.rating || 0) 
                                  ? "text-yellow-400 fill-current" 
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span>({plan.rating})</span>
                      </div>
                    )}
                    
                    {plan.memo && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {plan.memo}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 사진 미리보기 */}
              {plan.photos && plan.photos.length > 0 && (
                <div className="flex-shrink-0 relative">
                  <div 
                    className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 사진 확대 보기 기능 추가 예정
                      console.log('사진 확대 보기:', plan.photos);
                    }}
                  >
                    <img
                      src={plan.photos[0]}
                      alt={plan.place_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {plan.photos.length > 1 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-1 right-1 bg-black/70 text-white border-0 text-xs px-1 py-0"
                    >
                      +{plan.photos.length - 1}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 유튜브 링크 표시 */}
        {plan.youtube_link && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <a
              href={plan.youtube_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-500 transition-colors duration-200 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-3 h-3 text-red-500" />
              <span className="line-clamp-1">유튜브 영상 보기</span>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

PlanCard.displayName = 'PlanCard';

export default PlanCard;