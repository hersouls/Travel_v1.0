'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { loadGoogleMapsAPI, isGoogleMapsLoaded } from '@/lib/google-maps/loader'
import { useTravelDays } from '@/lib/hooks/useTravelDays'
import { useTravelPlans } from '@/hooks/useTravelPlans'
import PlanMarker from './PlanMarker'
import { DayPlan } from '@/lib/types/database'
import { MapPin, Route, EyeOff, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface TravelMapProps {
  travelId?: string
  dayId?: string
  className?: string
}

export default function TravelMap({ travelId, dayId, className }: TravelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<DayPlan | null>(null)
  const [showDirections, setShowDirections] = useState(false)
  const [mapCenter] = useState({ lat: 37.5665, lng: 126.9780 }) // 서울 기본 위치

  // 데이터 fetching
  const { data: travelDays } = useTravelDays(travelId || '')
  const { travelPlans } = useTravelPlans()

  // 모든 계획 데이터 수집
  const allPlans = useMemo(() => {
    return travelId 
      ? travelDays?.flatMap(day => 
          dayId 
            ? day.id === dayId ? day.day_plans || [] : []
            : day.day_plans || []
        ) || []
      : travelPlans?.flatMap(travel => 
          travel.travel_days?.flatMap(day => day.day_plans || []) || []
        ) || []
  }, [travelId, travelDays, dayId, travelPlans])

  // 지도 초기화
  const initializeMap = useCallback(async () => {
    if (!mapRef.current) return

    try {
      setIsLoading(true)
      
      if (!isGoogleMapsLoaded()) {
        await loadGoogleMapsAPI()
      }

      // 지도 인스턴스 생성
      const map = new google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Directions 서비스 초기화
      directionsServiceRef.current = new google.maps.DirectionsService()
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // 우리 커스텀 마커 사용
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 3,
          strokeOpacity: 0.8
        }
      })
      directionsRendererRef.current.setMap(map)

      mapInstanceRef.current = map

      // 계획이 있으면 해당 위치로 중심 이동
      if (allPlans.length > 0) {
        const bounds = new google.maps.LatLngBounds()
        allPlans.forEach(plan => {
          if (plan.latitude && plan.longitude) {
            bounds.extend({
              lat: parseFloat(plan.latitude.toString()),
              lng: parseFloat(plan.longitude.toString())
            })
          }
        })
        map.fitBounds(bounds)
      }

      setError(null)
    } catch (err) {
      console.error('Google Maps 초기화 실패:', err)
      setError('지도를 불러올 수 없습니다. 네트워크 연결을 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }, [mapCenter, allPlans])

  // 경로 표시 토글
  const toggleDirections = useCallback(() => {
    if (!mapInstanceRef.current || !directionsServiceRef.current || !directionsRendererRef.current) return

    if (showDirections) {
      directionsRendererRef.current.setDirections({
        routes: [],
        request: {} as google.maps.DirectionsRequest
      } as google.maps.DirectionsResult)
      setShowDirections(false)
      return
    }

    // 시간이 설정된 계획들만 경로 계산
    const timedPlans = allPlans
      .filter(plan => plan.planned_time && plan.latitude && plan.longitude)
      .sort((a, b) => a.planned_time!.localeCompare(b.planned_time!))

    if (timedPlans.length < 2) {
      alert('경로를 표시하려면 시간이 설정된 계획이 최소 2개 필요합니다.')
      return
    }

    const origin = {
      lat: parseFloat(timedPlans[0].latitude!.toString()),
      lng: parseFloat(timedPlans[0].longitude!.toString())
    }
    const destination = {
      lat: parseFloat(timedPlans[timedPlans.length - 1].latitude!.toString()),
      lng: parseFloat(timedPlans[timedPlans.length - 1].longitude!.toString())
    }
    const waypoints = timedPlans.slice(1, -1).map(plan => ({
      location: {
        lat: parseFloat(plan.latitude!.toString()),
        lng: parseFloat(plan.longitude!.toString())
      },
      stopover: true
    }))

    directionsServiceRef.current.route({
      origin,
      destination,
      waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    }, (result, status) => {
      if (status === 'OK' && result) {
        directionsRendererRef.current!.setDirections(result)
        setShowDirections(true)
      } else {
        console.error('경로 계산 실패:', status)
        alert('경로를 계산할 수 없습니다.')
      }
    })
  }, [allPlans, showDirections])

  // 내 위치로 이동
  const goToMyLocation = useCallback(() => {
    if (!mapInstanceRef.current) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        mapInstanceRef.current!.setCenter(pos)
        mapInstanceRef.current!.setZoom(15)
        
        // 내 위치 마커 추가
        new google.maps.Marker({
          position: pos,
          map: mapInstanceRef.current!,
          title: '내 위치',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="3"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          }
        })
      }, () => {
        alert('위치 정보를 가져올 수 없습니다.')
      })
    } else {
      alert('이 브라우저는 위치 서비스를 지원하지 않습니다.')
    }
  }, [])

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback((plan: DayPlan) => {
    setSelectedPlan(plan)
  }, [])

  // 컴포넌트 마운트 시 지도 초기화
  useEffect(() => {
    initializeMap()
  }, [initializeMap])

  if (isLoading) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-travel-city rounded-full mx-auto mb-3 animate-pulse flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-6">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">지도를 불러올 수 없습니다</h3>
          <p className="text-gray-600 mb-4 break-keep-ko">{error}</p>
          <Button onClick={initializeMap} variant="default">
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Google Maps 컨테이너 */}
      <div ref={mapRef} className="w-full h-full" />

      {/* 마커들 렌더링 */}
      {allPlans.map((plan) => (
        <PlanMarker
          key={plan.id}
          plan={plan}
          map={mapInstanceRef.current}
          onClick={handleMarkerClick}
          isSelected={selectedPlan?.id === plan.id}
        />
      ))}

      {/* 컨트롤 패널 */}
      <div className="absolute top-4 right-4 space-y-2">
        <Card className="p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDirections}
              className={`w-full ${showDirections ? 'bg-travel-city text-white' : ''}`}
            >
              <Route className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToMyLocation}
              className="w-full"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* 하단 정보 패널 */}
      {selectedPlan && (
        <Card className="absolute bottom-4 left-4 right-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {/* 계획 유형 아이콘 */}
              <div className="w-12 h-12 bg-travel-city rounded-full flex items-center justify-center text-white text-xl">
                {selectedPlan.plan_type === 'restaurant' && '🍽️'}
                {selectedPlan.plan_type === 'sightseeing' && '🏛️'}
                {selectedPlan.plan_type === 'accommodation' && '🏨'}
                {selectedPlan.plan_type === 'transportation' && '🚗'}
                {selectedPlan.plan_type === 'shopping' && '🛍️'}
                {selectedPlan.plan_type === 'entertainment' && '🎯'}
                {selectedPlan.plan_type === 'meeting' && '👥'}
                {!['restaurant', 'sightseeing', 'accommodation', 'transportation', 'shopping', 'entertainment', 'meeting'].includes(selectedPlan.plan_type) && '📝'}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 break-keep-ko">
                  {selectedPlan.place_name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {selectedPlan.plan_type === 'restaurant' && '식당'}
                  {selectedPlan.plan_type === 'sightseeing' && '관광'}
                  {selectedPlan.plan_type === 'accommodation' && '숙박'}
                  {selectedPlan.plan_type === 'transportation' && '교통'}
                  {selectedPlan.plan_type === 'shopping' && '쇼핑'}
                  {selectedPlan.plan_type === 'entertainment' && '여가'}
                  {selectedPlan.plan_type === 'meeting' && '만남'}
                  {!['restaurant', 'sightseeing', 'accommodation', 'transportation', 'shopping', 'entertainment', 'meeting'].includes(selectedPlan.plan_type) && '기타'}
                </Badge>
              </div>
              
              {selectedPlan.place_address && (
                <p className="text-sm text-gray-600 mb-1">📍 {selectedPlan.place_address}</p>
              )}
              
              {selectedPlan.planned_time && (
                <p className="text-sm text-gray-600 mb-1">⏰ {selectedPlan.planned_time.slice(0, 5)}</p>
              )}
              
              {selectedPlan.budget && (
                <p className="text-sm text-travel-food font-medium mb-1">
                  💰 {selectedPlan.budget.toLocaleString()}원
                </p>
              )}
              
              {selectedPlan.notes && (
                <p className="text-sm text-gray-700 break-keep-ko line-clamp-2">
                  {selectedPlan.notes}
                </p>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPlan(null)}
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* 통계 정보 (계획이 없을 때) */}
      {allPlans.length === 0 && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 text-center">
          <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <h3 className="font-semibold text-gray-900 mb-1">표시할 계획이 없습니다</h3>
          <p className="text-sm text-gray-600 break-keep-ko">
            여행 계획을 추가하면 지도에서 확인할 수 있습니다.
          </p>
        </Card>
      )}
    </div>
  )
}