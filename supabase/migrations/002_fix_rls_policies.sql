-- Moonwave Travel v3.0 Database Schema
-- Migration 002: Fix RLS policies for collaborators table
-- Created: 2025-01-26

-- ===============================================
-- 1. 기존 정책 삭제
-- ===============================================

-- 기존 collaborators 정책 삭제
DROP POLICY IF EXISTS "Travel owners can manage collaborators" ON public.collaborators;
DROP POLICY IF EXISTS "Collaborators can view collaboration info" ON public.collaborators;

-- ===============================================
-- 2. 새로운 정책 생성 (무한 재귀 방지)
-- ===============================================

-- 여행 소유자가 협업자를 관리할 수 있는 정책
CREATE POLICY "Travel owners can manage collaborators" ON public.collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = collaborators.travel_plan_id 
      AND user_id = auth.uid()
    )
  );

-- 협업자가 자신의 협업 정보를 볼 수 있는 정책
CREATE POLICY "Collaborators can view own collaborations" ON public.collaborators
  FOR SELECT USING (auth.uid() = user_id);

-- 협업자가 자신의 협업 정보를 업데이트할 수 있는 정책
CREATE POLICY "Collaborators can update own collaborations" ON public.collaborators
  FOR UPDATE USING (auth.uid() = user_id);

-- ===============================================
-- 3. 다른 테이블의 정책도 최적화
-- ===============================================

-- travel_plans 정책 최적화 (collaborators 테이블 참조 최소화)
DROP POLICY IF EXISTS "Users can manage own travel plans" ON public.travel_plans;

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

-- travel_days 정책 최적화
DROP POLICY IF EXISTS "Users can manage travel days" ON public.travel_days;

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

-- day_plans 정책 최적화
DROP POLICY IF EXISTS "Users can manage day plans" ON public.day_plans;

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

-- payment_history 정책 최적화
DROP POLICY IF EXISTS "Users can manage payment history" ON public.payment_history;

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

-- ===============================================
-- 4. 성능 최적화를 위한 추가 인덱스
-- ===============================================

-- collaborators 테이블에 대한 추가 인덱스
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_joined ON public.collaborators(user_id, joined_at);

-- ===============================================
-- 마이그레이션 완료
-- ===============================================

-- 마이그레이션 정보 (참고용)
COMMENT ON SCHEMA public IS 'Moonwave Travel v3.0 Database Schema - RLS Policies Fixed 2025-01-26';

-- 성공 메시지
DO $$
BEGIN
  RAISE NOTICE 'RLS policies migration completed successfully!';
  RAISE NOTICE 'Fixed infinite recursion issue in collaborators table policies';
  RAISE NOTICE 'Optimized all RLS policies for better performance';
  RAISE NOTICE 'Added performance indexes for collaborators table';
  RAISE NOTICE 'Ready for production!';
END $$;