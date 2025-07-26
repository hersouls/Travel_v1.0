// Google Maps API 타입 정의
declare global {
  interface Window {
    google: typeof google
  }
}

export interface MapOptions {
  center: google.maps.LatLng | google.maps.LatLngLiteral
  zoom: number
  mapTypeId?: google.maps.MapTypeId
  disableDefaultUI?: boolean
  zoomControl?: boolean
  streetViewControl?: boolean
  fullscreenControl?: boolean
  mapTypeControl?: boolean
}

export interface MarkerOptions {
  position: google.maps.LatLng | google.maps.LatLngLiteral
  map: google.maps.Map
  title?: string
  icon?: string | google.maps.Icon | google.maps.Symbol
  draggable?: boolean
}

export interface PlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: google.maps.LatLng
    viewport: google.maps.LatLngBounds
  }
  types: string[]
  rating?: number
  photos?: google.maps.places.PlacePhoto[]
}

export interface DirectionsRequest {
  origin: string | google.maps.LatLng | google.maps.LatLngLiteral
  destination: string | google.maps.LatLng | google.maps.LatLngLiteral
  travelMode: google.maps.TravelMode
  waypoints?: google.maps.DirectionsWaypoint[]
  optimizeWaypoints?: boolean
}

export interface GeocodingRequest {
  address?: string
  location?: google.maps.LatLng | google.maps.LatLngLiteral
  placeId?: string
  bounds?: google.maps.LatLngBounds
  language?: string
  region?: string
}