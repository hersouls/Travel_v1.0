// Moonwave Travel v3.0 Database Types
// TypeScript 타입 정의 - Supabase 스키마 기반
// Created: 2025-07-26

// ===============================================
// 1. 기본 타입 정의
// ===============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ===============================================
// 2. 데이터베이스 스키마 타입
// ===============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          subscription_count: number
          total_monthly_cost: number
          preferences: Json
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          subscription_count?: number
          total_monthly_cost?: number
          preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          subscription_count?: number
          total_monthly_cost?: number
          preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      travel_plans: {
        Row: {
          id: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          description: string | null
          cover_image_url: string | null
          is_public: boolean
          status: TravelStatus
          collaborators: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          description?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          status?: TravelStatus
          collaborators?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          description?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          status?: TravelStatus
          collaborators?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      travel_days: {
        Row: {
          id: string
          travel_plan_id: string
          day_number: number
          date: string
          title: string | null
          theme: string | null
          created_at: string
        }
        Insert: {
          id?: string
          travel_plan_id: string
          day_number: number
          date: string
          title?: string | null
          theme?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          travel_plan_id?: string
          day_number?: number
          date?: string
          title?: string | null
          theme?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_days_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      day_plans: {
        Row: {
          id: string
          travel_day_id: string
          place_name: string
          place_address: string | null
          google_place_id: string | null
          latitude: number | null
          longitude: number | null
          planned_time: string | null
          duration_minutes: number | null
          plan_type: PlanType
          notes: string | null
          image_urls: string[]
          youtube_url: string | null
          budget: number | null
          order_index: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          travel_day_id: string
          place_name: string
          place_address?: string | null
          google_place_id?: string | null
          latitude?: number | null
          longitude?: number | null
          planned_time?: string | null
          duration_minutes?: number | null
          plan_type?: PlanType
          notes?: string | null
          image_urls?: string[]
          youtube_url?: string | null
          budget?: number | null
          order_index?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          travel_day_id?: string
          place_name?: string
          place_address?: string | null
          google_place_id?: string | null
          latitude?: number | null
          longitude?: number | null
          planned_time?: string | null
          duration_minutes?: number | null
          plan_type?: PlanType
          notes?: string | null
          image_urls?: string[]
          youtube_url?: string | null
          budget?: number | null
          order_index?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "day_plans_travel_day_id_fkey"
            columns: ["travel_day_id"]
            isOneToOne: false
            referencedRelation: "travel_days"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_history: {
        Row: {
          id: string
          travel_plan_id: string | null
          day_plan_id: string | null
          amount: number
          currency: Currency
          payment_date: string
          status: PaymentStatus
          payment_method: string | null
          receipt_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          travel_plan_id?: string | null
          day_plan_id?: string | null
          amount: number
          currency?: Currency
          payment_date: string
          status?: PaymentStatus
          payment_method?: string | null
          receipt_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          travel_plan_id?: string | null
          day_plan_id?: string | null
          amount?: number
          currency?: Currency
          payment_date?: string
          status?: PaymentStatus
          payment_method?: string | null
          receipt_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_day_plan_id_fkey"
            columns: ["day_plan_id"]
            isOneToOne: false
            referencedRelation: "day_plans"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string | null
          is_read: boolean
          scheduled_at: string | null
          sent_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message?: string | null
          is_read?: boolean
          scheduled_at?: string | null
          sent_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string | null
          is_read?: boolean
          scheduled_at?: string | null
          sent_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          icon: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          icon?: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          icon?: string
          is_default?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      collaborators: {
        Row: {
          id: string
          travel_plan_id: string
          user_id: string
          role: CollaboratorRole
          permissions: string[]
          invited_at: string
          joined_at: string | null
        }
        Insert: {
          id?: string
          travel_plan_id: string
          user_id: string
          role?: CollaboratorRole
          permissions?: string[]
          invited_at?: string
          joined_at?: string | null
        }
        Update: {
          id?: string
          travel_plan_id?: string
          user_id?: string
          role?: CollaboratorRole
          permissions?: string[]
          invited_at?: string
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_travel_plan_id_fkey"
            columns: ["travel_plan_id"]
            isOneToOne: false
            referencedRelation: "travel_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_sample_travel_data: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
      cleanup_test_data: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
      get_user_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_travels: number
          total_plans: number
          total_spent: number
          active_notifications: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ===============================================
// 3. 열거형 타입 정의
// ===============================================

export type TravelStatus = 'planning' | 'ongoing' | 'completed' | 'cancelled'

export type PlanType = 
  | 'sightseeing' 
  | 'restaurant' 
  | 'accommodation' 
  | 'transportation' 
  | 'shopping' 
  | 'entertainment' 
  | 'meeting' 
  | 'others'

export type Currency = 'KRW' | 'USD' | 'JPY' | 'EUR'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export type NotificationType = 'travel_reminder' | 'plan_update' | 'collaboration' | 'system'

export type CollaboratorRole = 'owner' | 'editor' | 'viewer'

// ===============================================
// 4. 편의를 위한 타입 별칭
// ===============================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']

export type TravelPlan = Database['public']['Tables']['travel_plans']['Row']
export type InsertTravelPlan = Database['public']['Tables']['travel_plans']['Insert']
export type UpdateTravelPlan = Database['public']['Tables']['travel_plans']['Update']

export type TravelDay = Database['public']['Tables']['travel_days']['Row']
export type InsertTravelDay = Database['public']['Tables']['travel_days']['Insert']
export type UpdateTravelDay = Database['public']['Tables']['travel_days']['Update']

export type DayPlan = Database['public']['Tables']['day_plans']['Row']
export type InsertDayPlan = Database['public']['Tables']['day_plans']['Insert']
export type UpdateDayPlan = Database['public']['Tables']['day_plans']['Update']

export type PaymentHistory = Database['public']['Tables']['payment_history']['Row']
export type InsertPaymentHistory = Database['public']['Tables']['payment_history']['Insert']
export type UpdatePaymentHistory = Database['public']['Tables']['payment_history']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type InsertNotification = Database['public']['Tables']['notifications']['Insert']
export type UpdateNotification = Database['public']['Tables']['notifications']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type InsertCategory = Database['public']['Tables']['categories']['Insert']
export type UpdateCategory = Database['public']['Tables']['categories']['Update']

export type Collaborator = Database['public']['Tables']['collaborators']['Row']
export type InsertCollaborator = Database['public']['Tables']['collaborators']['Insert']
export type UpdateCollaborator = Database['public']['Tables']['collaborators']['Update']

// ===============================================
// 5. 관계형 타입 정의 (JOIN 결과)
// ===============================================

// 여행 계획과 관련 데이터를 포함한 확장 타입
export interface TravelPlanWithDetails extends Omit<TravelPlan, 'collaborators'> {
  travel_days: (TravelDay & {
    day_plans: DayPlan[]
  })[]
  payment_history: PaymentHistory[]
  collaborators: (Collaborator & {
    profile: Pick<Profile, 'id' | 'name' | 'email' | 'avatar_url'>
  })[]
}

// Day별 계획과 세부 계획들
export interface TravelDayWithPlans extends TravelDay {
  day_plans: DayPlan[]
}

// 사용자 프로필과 여행 통계
export interface ProfileWithStats extends Profile {
  travel_stats: {
    total_travels: number
    active_travels: number
    completed_travels: number
    total_plans: number
    total_spent: number
  }
}

// 결제 이력과 관련 여행/계획 정보
export interface PaymentHistoryWithDetails extends PaymentHistory {
  travel_plan?: Pick<TravelPlan, 'id' | 'title' | 'destination'>
  day_plan?: Pick<DayPlan, 'id' | 'place_name' | 'plan_type'>
}

// ===============================================
// 6. API 응답 타입
// ===============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error: string | null
}

// ===============================================
// 7. 폼 관련 타입
// ===============================================

export interface CreateTravelPlanForm {
  title: string
  destination: string
  start_date: string
  end_date: string
  description?: string
  cover_image_url?: string
  is_public?: boolean
}

export interface CreateDayPlanForm {
  place_name: string
  place_address?: string
  google_place_id?: string
  latitude?: number
  longitude?: number
  planned_time?: string
  duration_minutes?: number
  plan_type?: PlanType
  notes?: string
  budget?: number
}

export interface UpdateProfileForm {
  name?: string
  avatar_url?: string
  preferences?: Json
  timezone?: string
}

// ===============================================
// 8. 필터 및 정렬 타입
// ===============================================

export interface TravelPlanFilters {
  status?: TravelStatus[]
  destination?: string
  start_date?: string
  end_date?: string
  is_public?: boolean
}

export interface DayPlanFilters {
  plan_type?: PlanType[]
  has_budget?: boolean
  min_budget?: number
  max_budget?: number
}

export type SortDirection = 'asc' | 'desc'

export interface SortOptions {
  field: string
  direction: SortDirection
}

// ===============================================
// 9. Google Maps 관련 타입
// ===============================================

export interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  opening_hours?: {
    open_now: boolean
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
}

export interface MapMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  title: string
  type: PlanType
  data: DayPlan
}

// ===============================================
// 10. 실시간 구독 타입
// ===============================================

export interface RealtimePayload<T> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: T | null
  old: T | null
  errors: string[] | null
}

export type TravelPlanRealtimePayload = RealtimePayload<TravelPlan>
export type DayPlanRealtimePayload = RealtimePayload<DayPlan>
export type NotificationRealtimePayload = RealtimePayload<Notification>

// ===============================================
// 11. 사용자 권한 타입
// ===============================================

export interface UserPermissions {
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  canInvite: boolean
  isOwner: boolean
}

export interface TravelPlanPermissions extends UserPermissions {
  canEditDetails: boolean
  canManageCollaborators: boolean
  canChangeVisibility: boolean
}

// ===============================================
// 타입 내보내기
// ===============================================

export default Database