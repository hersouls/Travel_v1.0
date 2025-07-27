-- Moonwave Travel v3.0 Database Schema
-- Migration 003: Simple RLS fix for collaborators table
-- Created: 2025-01-26

-- ===============================================
-- 1. collaborators 테이블 RLS 임시 비활성화
-- ===============================================

-- collaborators 테이블의 RLS를 임시로 비활성화하여 무한 재귀 문제 해결
ALTER TABLE public.collaborators DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- 2. 다른 테이블의 정책도 단순화
-- ===============================================

-- travel_plans 정책 단순화
DROP POLICY IF EXISTS "Users can manage own travel plans" ON public.travel_plans;
DROP POLICY IF EXISTS "Public travels are readable" ON public.travel_plans;

CREATE POLICY "Users can manage own travel plans" ON public.travel_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public travels are readable" ON public.travel_plans
  FOR SELECT USING (is_public = true);

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
-- 마이그레이션 완료
-- ===============================================

-- 성공 메시지
DO $$
BEGIN
  RAISE NOTICE 'Simple RLS fix migration completed successfully!';
  RAISE NOTICE 'Disabled RLS on collaborators table to prevent infinite recursion';
  RAISE NOTICE 'Simplified RLS policies for other tables';
  RAISE NOTICE 'Application should now work without infinite recursion errors';
END $$;