-- Travel Likes System Migration
-- 여행 계획에 대한 좋아요 기능

-- travel_likes 테이블 생성
CREATE TABLE IF NOT EXISTS public.travel_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  travel_plan_id UUID NOT NULL REFERENCES public.travel_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- 사용자는 각 여행 계획에 대해 한 번만 좋아요 가능
  UNIQUE(travel_plan_id, user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS travel_likes_travel_plan_id_idx ON public.travel_likes(travel_plan_id);
CREATE INDEX IF NOT EXISTS travel_likes_user_id_idx ON public.travel_likes(user_id);
CREATE INDEX IF NOT EXISTS travel_likes_created_at_idx ON public.travel_likes(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.travel_likes ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- 사용자는 자신의 좋아요만 삽입 가능
CREATE POLICY "Users can insert their own likes" ON public.travel_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 좋아요만 삭제 가능  
CREATE POLICY "Users can delete their own likes" ON public.travel_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 공개된 여행 계획의 좋아요는 모두가 볼 수 있음
CREATE POLICY "Public travel likes are viewable by everyone" ON public.travel_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans tp 
      WHERE tp.id = travel_plan_id 
      AND tp.is_public = true
    )
  );

-- 자신의 여행 계획에 대한 좋아요는 볼 수 있음
CREATE POLICY "Users can view likes on their own travels" ON public.travel_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans tp 
      WHERE tp.id = travel_plan_id 
      AND tp.user_id = auth.uid()
    )
  );

-- travel_plans 테이블에 likes_count 컬럼 추가 (캐시용)
ALTER TABLE public.travel_plans 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- 좋아요 수 업데이트 함수
CREATE OR REPLACE FUNCTION public.update_travel_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.travel_plans 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.travel_plan_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.travel_plans 
    SET likes_count = GREATEST(0, likes_count - 1) 
    WHERE id = OLD.travel_plan_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (좋아요 추가/삭제 시 자동으로 카운트 업데이트)
DROP TRIGGER IF EXISTS update_travel_likes_count_trigger ON public.travel_likes;
CREATE TRIGGER update_travel_likes_count_trigger
  AFTER INSERT OR DELETE ON public.travel_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_travel_likes_count();

-- 기존 데이터에 대한 likes_count 초기화
UPDATE public.travel_plans 
SET likes_count = (
  SELECT COUNT(*) 
  FROM public.travel_likes 
  WHERE travel_plan_id = travel_plans.id
);

-- 좋아요 관련 뷰 생성 (통계용)
CREATE OR REPLACE VIEW public.travel_likes_stats AS
SELECT 
  tp.id as travel_plan_id,
  tp.title as travel_title,
  tp.user_id as travel_owner_id,
  COUNT(tl.id) as total_likes,
  COUNT(tl.id) FILTER (WHERE tl.created_at >= NOW() - INTERVAL '7 days') as weekly_likes,
  COUNT(tl.id) FILTER (WHERE tl.created_at >= NOW() - INTERVAL '30 days') as monthly_likes,
  ARRAY_AGG(
    json_build_object(
      'user_id', tl.user_id,
      'created_at', tl.created_at
    ) ORDER BY tl.created_at DESC
  ) FILTER (WHERE tl.id IS NOT NULL) as recent_likes
FROM public.travel_plans tp
LEFT JOIN public.travel_likes tl ON tp.id = tl.travel_plan_id
WHERE tp.is_public = true
GROUP BY tp.id, tp.title, tp.user_id;

-- 뷰에 대한 RLS 정책 (공개 여행만 조회 가능)
ALTER VIEW public.travel_likes_stats SET (security_barrier = true);

COMMENT ON TABLE public.travel_likes IS '여행 계획 좋아요 시스템';
COMMENT ON COLUMN public.travel_likes.travel_plan_id IS '좋아요한 여행 계획 ID';
COMMENT ON COLUMN public.travel_likes.user_id IS '좋아요한 사용자 ID';
COMMENT ON VIEW public.travel_likes_stats IS '여행 계획별 좋아요 통계 뷰';

-- 마이그레이션 완료 로그
DO $$
BEGIN
  RAISE NOTICE 'Travel Likes System Migration completed successfully!';
  RAISE NOTICE 'Features added:';
  RAISE NOTICE '- travel_likes table with RLS policies';
  RAISE NOTICE '- Automatic likes count updates';
  RAISE NOTICE '- Travel likes statistics view';
END $$;