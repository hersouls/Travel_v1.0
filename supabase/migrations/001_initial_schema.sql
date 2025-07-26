-- Moonwave Travel v3.0 Database Schema
-- Initial migration: Core tables, RLS policies, triggers, and indexes
-- Created: 2025-07-26

-- ===============================================
-- 1. 확장 기능 활성화
-- ===============================================

-- UUID 생성을 위한 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- 2. 사용자 프로필 테이블
-- ===============================================

-- 사용자 프로필 테이블 (auth.users와 1:1 관계)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  subscription_count INTEGER DEFAULT 0,
  total_monthly_cost DECIMAL(10,2) DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  timezone TEXT DEFAULT 'Asia/Seoul',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 프로필 테이블 코멘트
COMMENT ON TABLE public.profiles IS 'User profiles with travel statistics and preferences';
COMMENT ON COLUMN public.profiles.subscription_count IS 'Total number of active travel plans';
COMMENT ON COLUMN public.profiles.total_monthly_cost IS 'Total monthly travel budget';
COMMENT ON COLUMN public.profiles.preferences IS 'User preferences in JSON format';

-- ===============================================
-- 3. 여행 계획 테이블
-- ===============================================

-- 여행 계획 메인 테이블
CREATE TABLE IF NOT EXISTS public.travel_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'planning',
  collaborators TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 제약조건
  CONSTRAINT travel_plans_date_check CHECK (end_date >= start_date),
  CONSTRAINT travel_plans_status_check CHECK (status IN ('planning', 'ongoing', 'completed', 'cancelled'))
);

-- 여행 일자별 테이블
CREATE TABLE IF NOT EXISTS public.travel_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_plan_id UUID NOT NULL REFERENCES public.travel_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  title TEXT,
  theme TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 제약조건
  CONSTRAINT travel_days_unique_day UNIQUE(travel_plan_id, day_number),
  CONSTRAINT travel_days_day_number_positive CHECK (day_number > 0)
);

-- 일자별 상세 계획 테이블
CREATE TABLE IF NOT EXISTS public.day_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_day_id UUID NOT NULL REFERENCES public.travel_days(id) ON DELETE CASCADE,
  place_name TEXT NOT NULL,
  place_address TEXT,
  google_place_id TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  planned_time TIME,
  duration_minutes INTEGER,
  plan_type TEXT DEFAULT 'sightseeing',
  notes TEXT,
  image_urls TEXT[] DEFAULT '{}',
  youtube_url TEXT,
  budget DECIMAL(10,2),
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 제약조건
  CONSTRAINT day_plans_plan_type_check CHECK (plan_type IN ('sightseeing', 'restaurant', 'accommodation', 'transportation', 'shopping', 'entertainment', 'meeting', 'others')),
  CONSTRAINT day_plans_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT day_plans_budget_positive CHECK (budget IS NULL OR budget >= 0),
  CONSTRAINT day_plans_order_positive CHECK (order_index >= 0)
);

-- ===============================================
-- 4. 결제 및 이력 테이블
-- ===============================================

-- 결제 이력 테이블
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_plan_id UUID REFERENCES public.travel_plans(id) ON DELETE CASCADE,
  day_plan_id UUID REFERENCES public.day_plans(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  payment_date DATE NOT NULL,
  status TEXT DEFAULT 'completed',
  payment_method TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 제약조건
  CONSTRAINT payment_history_amount_positive CHECK (amount >= 0),
  CONSTRAINT payment_history_currency_check CHECK (currency IN ('KRW', 'USD', 'JPY', 'EUR')),
  CONSTRAINT payment_history_status_check CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
);

-- ===============================================
-- 5. 확장 기능 테이블들
-- ===============================================

-- 알림 테이블
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 제약조건
  CONSTRAINT notifications_type_check CHECK (type IN ('travel_reminder', 'plan_update', 'collaboration', 'system'))
);

-- 사용자 정의 카테고리 테이블
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT 'map-pin',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 제약조건
  CONSTRAINT categories_unique_user_name UNIQUE(user_id, name)
);

-- 협업자 테이블
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  travel_plan_id UUID NOT NULL REFERENCES public.travel_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer',
  permissions TEXT[] DEFAULT '{"read"}',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  
  -- 제약조건
  CONSTRAINT collaborators_unique_user_travel UNIQUE(travel_plan_id, user_id),
  CONSTRAINT collaborators_role_check CHECK (role IN ('owner', 'editor', 'viewer'))
);

-- ===============================================
-- 6. 인덱스 생성
-- ===============================================

-- 성능 최적화를 위한 인덱스들
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON public.travel_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_plans_status ON public.travel_plans(status);
CREATE INDEX IF NOT EXISTS idx_travel_plans_created_at ON public.travel_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_days_travel_plan_id ON public.travel_days(travel_plan_id);
CREATE INDEX IF NOT EXISTS idx_travel_days_date ON public.travel_days(date);
CREATE INDEX IF NOT EXISTS idx_day_plans_travel_day_id ON public.day_plans(travel_day_id);
CREATE INDEX IF NOT EXISTS idx_day_plans_google_place_id ON public.day_plans(google_place_id);
CREATE INDEX IF NOT EXISTS idx_day_plans_order ON public.day_plans(travel_day_id, order_index);
CREATE INDEX IF NOT EXISTS idx_payment_history_travel_plan_id ON public.payment_history(travel_plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_date ON public.payment_history(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_travel_plan_id ON public.collaborators(travel_plan_id);

-- ===============================================
-- 7. RLS (Row Level Security) 정책
-- ===============================================

-- 모든 테이블에 RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

-- 프로필 정책
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 여행 계획 정책
CREATE POLICY "Users can manage own travel plans" ON public.travel_plans
  FOR ALL USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.collaborators 
      WHERE travel_plan_id = travel_plans.id 
      AND user_id = auth.uid()
      AND joined_at IS NOT NULL
    )
  );

CREATE POLICY "Public travels are readable" ON public.travel_plans
  FOR SELECT USING (is_public = true);

-- 여행 일자 정책
CREATE POLICY "Users can manage travel days" ON public.travel_days
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = travel_days.travel_plan_id 
      AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.collaborators 
          WHERE travel_plan_id = travel_plans.id 
          AND user_id = auth.uid()
          AND joined_at IS NOT NULL
        )
      )
    )
  );

-- 일자별 계획 정책
CREATE POLICY "Users can manage day plans" ON public.day_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_days td
      JOIN public.travel_plans tp ON td.travel_plan_id = tp.id
      WHERE td.id = day_plans.travel_day_id 
      AND (
        tp.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.collaborators 
          WHERE travel_plan_id = tp.id 
          AND user_id = auth.uid()
          AND joined_at IS NOT NULL
        )
      )
    )
  );

-- 결제 이력 정책
CREATE POLICY "Users can manage payment history" ON public.payment_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = payment_history.travel_plan_id 
      AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.collaborators 
          WHERE travel_plan_id = travel_plans.id 
          AND user_id = auth.uid()
          AND joined_at IS NOT NULL
        )
      )
    )
  );

-- 알림 정책
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- 카테고리 정책
CREATE POLICY "Users can manage own categories" ON public.categories
  FOR ALL USING (auth.uid() = user_id);

-- 협업자 정책
CREATE POLICY "Travel owners can manage collaborators" ON public.collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = collaborators.travel_plan_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can view collaboration info" ON public.collaborators
  FOR SELECT USING (auth.uid() = user_id);

-- ===============================================
-- 8. 트리거 함수 생성
-- ===============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 사용자 통계 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_user_travel_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET 
    subscription_count = (
      SELECT COUNT(*) FROM public.travel_plans 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
      AND status IN ('planning', 'ongoing')
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 여행 일자 자동 생성 함수
CREATE OR REPLACE FUNCTION public.generate_travel_days()
RETURNS TRIGGER AS $$
DECLARE
  day_count INTEGER;
  travel_date DATE;
  day_num INTEGER;
BEGIN
  -- 여행 기간 계산
  day_count := NEW.end_date - NEW.start_date + 1;
  travel_date := NEW.start_date;
  
  -- 각 일자별로 travel_days 레코드 생성
  FOR day_num IN 1..day_count LOOP
    INSERT INTO public.travel_days (
      travel_plan_id, 
      day_number, 
      date, 
      title
    ) VALUES (
      NEW.id, 
      day_num, 
      travel_date, 
      'Day ' || day_num
    );
    travel_date := travel_date + 1;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 9. 트리거 생성
-- ===============================================

-- updated_at 트리거들
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_travel_plans_updated_at 
  BEFORE UPDATE ON public.travel_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_day_plans_updated_at 
  BEFORE UPDATE ON public.day_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 사용자 통계 업데이트 트리거
CREATE TRIGGER update_travel_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.travel_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_user_travel_stats();

-- 여행 일자 자동 생성 트리거
CREATE TRIGGER generate_travel_days_trigger
  AFTER INSERT ON public.travel_plans
  FOR EACH ROW EXECUTE FUNCTION public.generate_travel_days();

-- ===============================================
-- 10. 기본 데이터 삽입
-- ===============================================

-- Note: Default categories will be created automatically when users sign up
-- through the application logic, not during migration to avoid foreign key issues

-- ===============================================
-- 마이그레이션 완료
-- ===============================================

-- 마이그레이션 정보 (참고용)
COMMENT ON SCHEMA public IS 'Moonwave Travel v3.0 Database Schema - Created 2025-07-26';

-- 성공 메시지
DO $$
BEGIN
  RAISE NOTICE 'Moonwave Travel Database Schema v1.0 migration completed successfully!';
  RAISE NOTICE 'Tables created: profiles, travel_plans, travel_days, day_plans, payment_history, notifications, categories, collaborators';
  RAISE NOTICE 'RLS policies enabled for all tables';
  RAISE NOTICE 'Triggers and indexes created';
  RAISE NOTICE 'Ready for development!';
END $$;