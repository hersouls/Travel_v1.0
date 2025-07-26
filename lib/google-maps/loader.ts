let isLoaded = false
let isLoading = false
let loadPromise: Promise<void> | null = null

export const loadGoogleMapsAPI = (): Promise<void> => {
  if (isLoaded) return Promise.resolve()
  if (isLoading) return loadPromise!
  
  isLoading = true
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&language=ko`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      isLoaded = true
      isLoading = false
      resolve()
    }
    
    script.onerror = () => {
      isLoading = false
      reject(new Error('Google Maps API 로드 실패'))
    }
    
    document.head.appendChild(script)
  })
  
  return loadPromise
}

// Google Maps API가 로드되었는지 확인
export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && typeof window !== 'undefined' && !!window.google && !!window.google.maps
}

// Google Maps API 로드 상태 리셋 (테스트용)
export const resetGoogleMapsLoader = (): void => {
  isLoaded = false
  isLoading = false
  loadPromise = null
}