import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plan } from '@/types';
import { planTypeConfig } from '@/lib/mockData';
import { formatTime } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import { Clock, MapPin } from 'lucide-react';

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
  const config = planTypeConfig[plan.type] || planTypeConfig.other;

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-300 hover:shadow-natural-strong hover:scale-[1.02] group natural-card',
        onClick && 'hover:border-primary-300'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* 시간 및 유형 */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-secondary-400" />
              <span className="text-sm font-medium text-secondary-900 golden-text-body">
                {formatTime(plan.start_time)} - {formatTime(plan.end_time)}
              </span>
            </div>
            
            <div className={cn(
              'inline-flex items-center space-x-2 px-3 py-1.5 rounded-natural-medium text-sm font-medium',
              config.color === 'bg-blue-500' ? 'bg-blue-100 text-blue-700' :
              config.color === 'bg-green-500' ? 'bg-green-100 text-green-700' :
              config.color === 'bg-orange-500' ? 'bg-orange-100 text-orange-700' :
              config.color === 'bg-purple-500' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            )}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </div>
          </div>

          {/* 장소 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-secondary-900 golden-text-title line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                  {plan.place_name}
                </h3>
                
                {showDetails && (
                  <div className="mt-2 space-y-1">
                    {plan.address && (
                      <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{plan.address}</span>
                      </div>
                    )}
                    
                    {plan.rating > 0 && (
                      <div className="flex items-center space-x-1 text-sm text-secondary-600 golden-text-body">
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.floor(plan.rating))}
                          {'☆'.repeat(5 - Math.floor(plan.rating))}
                        </span>
                        <span>({plan.rating})</span>
                      </div>
                    )}
                    
                    {plan.memo && (
                      <p className="text-sm text-secondary-600 golden-text-body line-clamp-2">
                        {plan.memo}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 사진 미리보기 */}
              {plan.photos && plan.photos.length > 0 && (
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-natural-medium overflow-hidden">
                    <img
                      src={plan.photos[0]}
                      alt={plan.place_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {plan.photos.length > 1 && (
                    <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-natural-small">
                      +{plan.photos.length - 1}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 유튜브 링크 표시 */}
        {plan.youtube_link && (
          <div className="mt-3 pt-3 border-t border-secondary-100">
            <div className="flex items-center space-x-2 text-sm text-secondary-600 golden-text-body">
              <span className="text-red-500">▶</span>
              <span className="line-clamp-1">유튜브 영상 포함</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;