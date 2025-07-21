-- Moonwave Travel Database Schema
-- Supabase PostgreSQL 스키마

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips (여행일정) 테이블
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    country TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans (여행계획) 테이블
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    day INTEGER NOT NULL CHECK (day > 0),
    place_name TEXT NOT NULL,
    start_time TIME,
    end_time TIME,
    type TEXT NOT NULL CHECK (type IN ('accommodation', 'attraction', 'restaurant', 'transport', 'other')),
    photos TEXT[] DEFAULT '{}',
    youtube_url TEXT,
    memo TEXT,
    google_place_id TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
    website TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_country ON public.trips(country);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_plans_trip_id ON public.plans(trip_id);
CREATE INDEX IF NOT EXISTS idx_plans_day ON public.plans(day);
CREATE INDEX IF NOT EXISTS idx_plans_type ON public.plans(type);
CREATE INDEX IF NOT EXISTS idx_plans_location ON public.plans(latitude, longitude);

-- Updated At 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated At 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON public.plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성

-- Users 정책
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Trips 정책
CREATE POLICY "Users can view own trips" ON public.trips
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
    FOR DELETE USING (auth.uid() = user_id);

-- Plans 정책
CREATE POLICY "Users can view plans from own trips" ON public.plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = plans.trip_id 
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert plans to own trips" ON public.plans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = plans.trip_id 
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update plans from own trips" ON public.plans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = plans.trip_id 
            AND trips.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete plans from own trips" ON public.plans
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = plans.trip_id 
            AND trips.user_id = auth.uid()
        )
    );

-- 함수 생성

-- 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 새 사용자 등록 시 프로필 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 여행 기간 계산 함수
CREATE OR REPLACE FUNCTION calculate_trip_duration(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN (end_date - start_date + 1);
END;
$$ LANGUAGE plpgsql;

-- 여행 통계 함수
CREATE OR REPLACE FUNCTION get_trip_stats(user_uuid UUID)
RETURNS TABLE (
    total_trips BIGINT,
    total_plans BIGINT,
    countries_visited BIGINT,
    avg_plans_per_trip DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT t.id) as total_trips,
        COUNT(p.id) as total_plans,
        COUNT(DISTINCT t.country) as countries_visited,
        CASE 
            WHEN COUNT(DISTINCT t.id) > 0 
            THEN ROUND(COUNT(p.id)::DECIMAL / COUNT(DISTINCT t.id), 2)
            ELSE 0 
        END as avg_plans_per_trip
    FROM public.trips t
    LEFT JOIN public.plans p ON t.id = p.trip_id
    WHERE t.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 뷰 생성

-- 여행 상세 정보 뷰
CREATE OR REPLACE VIEW trip_details AS
SELECT 
    t.*,
    u.name as user_name,
    u.email as user_email,
    COUNT(p.id) as plans_count,
    calculate_trip_duration(t.start_date, t.end_date) as duration_days
FROM public.trips t
JOIN public.users u ON t.user_id = u.id
LEFT JOIN public.plans p ON t.id = p.trip_id
GROUP BY t.id, u.name, u.email;

-- 계획별 통계 뷰
CREATE OR REPLACE VIEW plan_stats AS
SELECT 
    trip_id,
    type,
    COUNT(*) as count,
    AVG(rating) as avg_rating
FROM public.plans
WHERE rating IS NOT NULL
GROUP BY trip_id, type;

-- 권한 설정
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 기본 데이터 삽입 (선택사항)
-- INSERT INTO public.users (id, email, name) VALUES 
--     ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User');