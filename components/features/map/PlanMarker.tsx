'use client';

import { useEffect, useRef, useCallback } from 'react';
import { DayPlan } from '@/lib/types/database';

interface PlanMarkerProps {
  plan: DayPlan;
  map: google.maps.Map | null;
  onClick?: (plan: DayPlan) => void;
  isSelected?: boolean;
}

export default function PlanMarker({
  plan,
  map,
  onClick,
  isSelected,
}: PlanMarkerProps) {
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // 계획 유형별 마커 스타일 설정
  const getPlanMarkerConfig = useCallback((planType: string) => {
    const configs = {
      restaurant: {
        color: '#f59e0b', // travel-food
        icon: '🍽️',
        label: '식당',
      },
      sightseeing: {
        color: '#10b981', // travel-mountain
        icon: '🏛️',
        label: '관광',
      },
      accommodation: {
        color: '#06b6d4', // travel-beach
        icon: '🏨',
        label: '숙박',
      },
      transportation: {
        color: '#6366f1', // travel-city
        icon: '🚗',
        label: '교통',
      },
      shopping: {
        color: '#ec4899', // travel-shopping
        icon: '🛍️',
        label: '쇼핑',
      },
      entertainment: {
        color: '#f97316', // travel-adventure
        icon: '🎯',
        label: '여가',
      },
      meeting: {
        color: '#8b5cf6', // travel-culture
        icon: '👥',
        label: '만남',
      },
      others: {
        color: '#6b7280', // gray-500
        icon: '📝',
        label: '기타',
      },
    };
    return configs[planType as keyof typeof configs] || configs.others;
  }, []);

  // SVG 마커 아이콘 생성
  const createMarkerIcon = useCallback(
    (config: ReturnType<typeof getPlanMarkerConfig>, selected: boolean) => {
      const size = selected ? 50 : 40;
      const strokeWidth = selected ? 3 : 2;
      const color = config.color;

      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" fill="${color}" stroke="white" stroke-width="${strokeWidth}"/>
          <text x="25" y="30" text-anchor="middle" font-size="16" fill="white">${config.icon}</text>
          ${selected ? `<circle cx="25" cy="25" r="22" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>` : ''}
        </svg>
      `)}`,
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(size / 2, size / 2),
      };
    },
    []
  );

  useEffect(() => {
    if (!map || !plan.latitude || !plan.longitude || typeof window === 'undefined') return;

    const config = getPlanMarkerConfig(plan.plan_type);
    const position = {
      lat: plan.latitude,
      lng: plan.longitude,
    };

    // 마커 생성
    const marker = new google.maps.Marker({
      position,
      map,
      title: plan.place_name,
      icon: createMarkerIcon(config, isSelected || false),
      draggable: false,
      optimized: false,
    });

    // 정보창 생성
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width: 300px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 18px;">${config.icon}</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${plan.place_name}</h3>
              <span style="font-size: 12px; padding: 2px 8px; background: ${config.color}; color: white; border-radius: 12px;">
                ${config.label}
              </span>
            </div>
          </div>
          ${plan.place_address ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;">📍 ${plan.place_address}</p>` : ''}
          ${plan.planned_time ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;">⏰ ${plan.planned_time.slice(0, 5)}</p>` : ''}
          ${plan.budget ? `<p style="margin: 4px 0; font-size: 14px; color: #f59e0b;">💰 ${plan.budget.toLocaleString()}원</p>` : ''}
          ${plan.notes ? `<p style="margin: 4px 0; font-size: 14px; color: #374151;">${plan.notes}</p>` : ''}
        </div>
      `,
    });

    // 클릭 이벤트 등록
    marker.addListener('click', () => {
      // 다른 열린 정보창들 닫기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // 현재 정보창 열기
      infoWindow.open(map, marker);
      infoWindowRef.current = infoWindow;

      // 외부 클릭 핸들러 호출
      if (onClick) {
        onClick(plan);
      }
    });

    markerRef.current = marker;

    return () => {
      marker.setMap(null);
      infoWindow.close();
    };
  }, [plan, map, isSelected, getPlanMarkerConfig, createMarkerIcon, onClick]);

  // 선택 상태 변경 시 아이콘 업데이트
  useEffect(() => {
    if (markerRef.current) {
      const config = getPlanMarkerConfig(plan.plan_type);
      markerRef.current.setIcon(createMarkerIcon(config, isSelected || false));
    }
  }, [isSelected, plan.plan_type, getPlanMarkerConfig, createMarkerIcon]);

  return null; // 이 컴포넌트는 DOM 렌더링하지 않음
}
