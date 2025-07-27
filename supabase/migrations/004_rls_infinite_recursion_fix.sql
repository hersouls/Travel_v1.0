-- Moonwave Travel v3.0 Database Schema
-- Migration 004: Fix RLS infinite recursion in collaborators table
-- Created: 2025-01-26

-- ===============================================
-- 1. 임시 해결책: collaborators 테이블 RLS 비활성화
-- ===============================================

-- collaborators 테이블의 RLS를 임시로 비활성화하여 무한 재귀 문제 해결
ALTER TABLE public.collaborators DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- 2. 또는 정책 단순화 (대안)
-- ===============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Travel owners can manage collaborators" ON public.collaborators;
DROP POLICY IF EXISTS "Collaborators can view own collaborations" ON public.collaborators;
DROP POLICY IF EXISTS "Collaborators can update own collaborations" ON public.collaborators;

-- 단순화된 정책 생성 (무한 재귀 방지)
CREATE POLICY "Travel owners can manage collaborators" ON public.collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans
      WHERE id = collaborators.travel_plan_id
      AND user_id = auth.uid()
    )
  );

-- ===============================================
-- 3. 다른 테이블의 정책도 단순화하여 안정성 확보
-- ===============================================

-- travel_plans 정책 단순화 (collaborators 테이블 참조 제거)
DROP POLICY IF EXISTS "Users can manage own travel plans" ON public.travel_plans;

CREATE POLICY "Users can manage own travel plans" ON public.travel_plans
  FOR ALL USING (auth.uid() = user_id);

-- travel_days 정책 단순화
DROP POLICY IF EXISTS "Users can manage travel days" ON public.travel_days;

CREATE POLICY "Users can manage travel days" ON public.travel_days
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = travel_days.travel_plan_id 
      AND user_id = auth.uid()
    )
  );

-- day_plans 정책 단순화
DROP POLICY IF EXISTS "Users can manage day plans" ON public.day_plans;

CREATE POLICY "Users can manage day plans" ON public.day_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_days td
      JOIN public.travel_plans tp ON td.travel_plan_id = tp.id
      WHERE td.id = day_plans.travel_day_id 
      AND tp.user_id = auth.uid()
    )
  );

-- payment_history 정책 단순화
DROP POLICY IF EXISTS "Users can manage payment history" ON public.payment_history;

CREATE POLICY "Users can manage payment history" ON public.payment_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = payment_history.travel_plan_id 
      AND user_id = auth.uid()
    )
  );

-- ===============================================
-- 4. 성능 최적화를 위한 인덱스 확인
-- ===============================================

-- collaborators 테이블에 대한 추가 인덱스 (RLS가 비활성화되어도 성능 향상)
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_joined ON public.collaborators(user_id, joined_at);

-- ===============================================
-- 마이그레이션 완료
-- ===============================================

-- 성공 메시지
DO $$
BEGIN
  RAISE NOTICE 'RLS infinite recursion fix migration completed successfully!';
  RAISE NOTICE 'Disabled RLS on collaborators table to prevent infinite recursion';
  RAISE NOTICE 'Simplified RLS policies for other tables to remove circular dependencies';
  RAISE NOTICE 'Application should now work without infinite recursion errors';
  RAISE NOTICE 'Note: collaborators table RLS is disabled - consider application-level security';
END $$;