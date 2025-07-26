-- Moonwave Travel v3.0 Test Data Seed
-- 실제 개발과 테스트에 사용할 여행 데이터
-- Created: 2025-07-26

-- ===============================================
-- 테스트 사용자 프로필 생성
-- ===============================================

-- 테스트용 사용자 프로필 (실제 auth.users가 생성된 후 수동으로 연결 필요)
-- 주의: 실제 Supabase Auth를 통해 사용자가 생성된 후에만 데이터 삽입 가능

-- ===============================================
-- 샘플 여행 계획 생성 함수
-- ===============================================

-- 샘플 데이터 생성 함수
CREATE OR REPLACE FUNCTION public.create_sample_travel_data(user_uuid UUID)
RETURNS void AS $$
DECLARE
  travel_1_id UUID;
  travel_2_id UUID;
  day_1_id UUID;
  day_2_id UUID;
  day_3_id UUID;
BEGIN
  -- 첫 번째 여행: 서울 2박 3일
  INSERT INTO public.travel_plans (
    id, user_id, title, destination, start_date, end_date, description, 
    cover_image_url, is_public, status
  ) VALUES (
    gen_random_uuid(), user_uuid, '서울 핫플레이스 투어', '서울, 대한민국', 
    '2025-08-01', '2025-08-03', '강남, 홍대, 명동을 중심으로 한 서울 핫플레이스 탐방',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451', 
    true, 'planning'
  ) RETURNING id INTO travel_1_id;

  -- 두 번째 여행: 제주도 3박 4일
  INSERT INTO public.travel_plans (
    id, user_id, title, destination, start_date, end_date, description, 
    cover_image_url, is_public, status
  ) VALUES (
    gen_random_uuid(), user_uuid, '제주도 힐링 여행', '제주특별자치도, 대한민국', 
    '2025-08-15', '2025-08-18', '제주도의 자연과 맛집을 즐기는 힐링 여행',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d7d6d0', 
    false, 'planning'
  ) RETURNING id INTO travel_2_id;

  -- ===============================================
  -- 서울 여행 상세 계획
  -- ===============================================

  -- Day 1 계획들 (자동 생성된 travel_days에 day_plans 추가)
  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '강남역', '서울 강남구 강남대로 396', 'ChIJKzG7ACuifDUR1QTK-0QKPEI',
    37.4979, 127.0276, '09:00', 30, 'transportation',
    '지하철 2호선으로 이동', 2500, 1
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 1;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '카페 테라스', '서울 강남구 테헤란로 152', NULL,
    37.4996, 127.0306, '09:30', 60, 'restaurant',
    '아침 식사 및 커피', 15000, 2
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 1;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '코엑스몰', '서울 강남구 영동대로 513', 'ChIJo5M_UjyifDURJo0KuZ4fVwE',
    37.5115, 127.0595, '11:00', 180, 'shopping',
    '쇼핑 및 구경', 50000, 3
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 1;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '봉피양 강남점', '서울 강남구 테헤란로 108길 24', NULL,
    37.4995, 127.0297, '14:30', 90, 'restaurant',
    '유명한 양고기 맛집', 35000, 4
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 1;

  -- Day 2 계획들
  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '홍대입구역', '서울 마포구 양화로 188', 'ChIJ9yT0P8WfDTURZf5RCSQJ',
    37.5567, 126.9227, '10:00', 30, 'transportation',
    '지하철 2호선으로 이동', 2500, 1
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 2;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '홍대 걷고싶은거리', '서울 마포구 어울마당로 200', NULL,
    37.5569, 126.9233, '10:30', 120, 'sightseeing',
    '홍대 문화거리 탐방', 0, 2
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 2;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '카페 멀바우', '서울 마포구 와우산로 24길 14', NULL,
    37.5548, 126.9248, '12:30', 60, 'restaurant',
    '홍대 감성 카페', 12000, 3
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 2;

  -- Day 3 계획들
  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '명동역', '서울 중구 명동8길 2', 'ChIJ_bbZEfmfDTURJwKJoVUJE1E',
    37.5606, 126.9868, '09:00', 30, 'transportation',
    '지하철 4호선으로 이동', 2500, 1
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 3;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '명동 쇼핑거리', '서울 중구 명동2길', NULL,
    37.5636, 126.9830, '09:30', 180, 'shopping',
    '명동 쇼핑 및 화장품 구매', 80000, 2
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_1_id AND td.day_number = 3;

  -- ===============================================
  -- 제주도 여행 상세 계획
  -- ===============================================

  -- Day 1 계획들
  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '제주국제공항', '제주특별자치도 제주시 공항로 2', 'ChIJuQQM_cmhC30RJLt-oQNnTE',
    33.5113, 126.4929, '09:00', 60, 'transportation',
    '항공편 도착 및 렌터카 픽업', 150000, 1
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 1;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '용두암', '제주특별자치도 제주시 용두암길 15', 'ChIJX8dBQkWhCTURqKlJIQ-HPQ',
    33.5151, 126.5194, '10:30', 60, 'sightseeing',
    '제주 대표 관광지', 0, 2
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 1;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '제주 오겹살', '제주특별자치도 제주시 연동 311-35', NULL,
    33.4896, 126.4917, '12:00', 90, 'restaurant',
    '제주 대표 흑돼지 맛집', 40000, 3
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 1;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '월정리 해수욕장', '제주특별자치도 제주시 구좌읍 월정리', 'ChIJ7eQv3OjhADURHKCxQqR8x0',
    33.5564, 126.7965, '15:00', 120, 'sightseeing',
    '에메랄드빛 바다 감상', 0, 4
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 1;

  -- Day 2 계획들
  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '성산일출봉', '제주특별자치도 서귀포시 성산읍 일출로 284-12', 'ChIJH_TcUj_FC30R_q8JDJDjyA',
    33.4584, 126.9428, '06:00', 120, 'sightseeing',
    '제주 대표 일출 명소', 5000, 1
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 2;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '우도', '제주특별자치도 제주시 우도면', 'ChIJZzH1Iq7CCTURp-FQlZ1KCUE',
    33.5009, 126.9509, '09:00', 240, 'sightseeing',
    '우도 땅콩아이스크림과 해안도로', 25000, 2
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 2;

  INSERT INTO public.day_plans (
    travel_day_id, place_name, place_address, google_place_id, 
    latitude, longitude, planned_time, duration_minutes, plan_type, 
    notes, budget, order_index
  ) 
  SELECT 
    td.id, '제주 해녀의 집', '제주특별자치도 서귀포시 성산읍 고성리 127', NULL,
    33.4739, 126.9292, '14:00', 90, 'restaurant',
    '신선한 해산물 정식', 35000, 3
  FROM public.travel_days td 
  WHERE td.travel_plan_id = travel_2_id AND td.day_number = 2;

  -- ===============================================
  -- 결제 이력 생성
  -- ===============================================

  -- 서울 여행 결제 이력들
  INSERT INTO public.payment_history (
    travel_plan_id, amount, currency, payment_date, status, payment_method
  ) VALUES 
    (travel_1_id, 102500, 'KRW', '2025-08-01', 'completed', '신용카드'),
    (travel_1_id, 47500, 'KRW', '2025-08-02', 'completed', '신용카드'),
    (travel_1_id, 82500, 'KRW', '2025-08-03', 'completed', '신용카드');

  -- 제주도 여행 결제 이력들
  INSERT INTO public.payment_history (
    travel_plan_id, amount, currency, payment_date, status, payment_method
  ) VALUES 
    (travel_2_id, 195000, 'KRW', '2025-08-15', 'completed', '신용카드'),
    (travel_2_id, 95000, 'KRW', '2025-08-16', 'completed', '신용카드');

  -- ===============================================
  -- 알림 생성
  -- ===============================================

  INSERT INTO public.notifications (
    user_id, type, title, message, scheduled_at
  ) VALUES 
    (user_uuid, 'travel_reminder', '서울 여행 D-7', '서울 핫플레이스 투어가 일주일 남았습니다!', '2025-07-25 09:00:00+09'),
    (user_uuid, 'travel_reminder', '제주도 여행 D-3', '제주도 힐링 여행이 3일 남았습니다. 준비물을 확인해보세요!', '2025-08-12 09:00:00+09');

  -- ===============================================
  -- 사용자 정의 카테고리
  -- ===============================================

  INSERT INTO public.categories (
    user_id, name, color, icon, is_default
  ) VALUES 
    (user_uuid, '힐링 여행', '#10b981', 'heart', false),
    (user_uuid, '도시 탐방', '#3b82f6', 'building', false),
    (user_uuid, '자연 여행', '#059669', 'tree', false);

  RAISE NOTICE 'Sample travel data created successfully for user: %', user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 사용 방법 가이드 (주석)
-- ===============================================

/*
이 시드 파일을 사용하는 방법:

1. 먼저 Supabase Auth를 통해 사용자 생성 (Google OAuth 등)
2. 생성된 사용자의 UUID 확인
3. 다음 SQL 실행:

-- 예시: 사용자 UUID가 '12345678-1234-1234-1234-123456789012'인 경우
SELECT public.create_sample_travel_data('12345678-1234-1234-1234-123456789012');

-- 생성된 데이터 확인
SELECT COUNT(*) as travel_plans FROM public.travel_plans;
SELECT COUNT(*) as day_plans FROM public.day_plans;
SELECT COUNT(*) as payment_history FROM public.payment_history;

주의사항:
- 실제 auth.users에 존재하는 UUID만 사용 가능
- RLS 정책으로 인해 해당 사용자로 로그인된 상태에서만 데이터 조회 가능
- 테스트 후 데이터 정리가 필요한 경우 해당 사용자의 모든 travel_plans 삭제하면 연쇄 삭제됨
*/

-- ===============================================
-- 추가 유틸리티 함수
-- ===============================================

-- 테스트 데이터 삭제 함수
CREATE OR REPLACE FUNCTION public.cleanup_test_data(user_uuid UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM public.travel_plans WHERE user_id = user_uuid;
  DELETE FROM public.notifications WHERE user_id = user_uuid;
  DELETE FROM public.categories WHERE user_id = user_uuid AND is_default = false;
  
  RAISE NOTICE 'Test data cleaned up for user: %', user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 사용자 통계 확인 함수
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE(
  total_travels INTEGER,
  total_plans INTEGER,
  total_spent DECIMAL,
  active_notifications INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM public.travel_plans WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM public.day_plans dp 
     JOIN public.travel_days td ON dp.travel_day_id = td.id
     JOIN public.travel_plans tp ON td.travel_plan_id = tp.id
     WHERE tp.user_id = user_uuid),
    (SELECT COALESCE(SUM(amount), 0) FROM public.payment_history ph
     JOIN public.travel_plans tp ON ph.travel_plan_id = tp.id
     WHERE tp.user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM public.notifications WHERE user_id = user_uuid AND is_read = false);
END;
$$ LANGUAGE plpgsql;

-- 마이그레이션 완료 메시지
DO $$
BEGIN
  RAISE NOTICE 'Moonwave Travel Test Data Seed v1.0 loaded successfully!';
  RAISE NOTICE 'Use: SELECT public.create_sample_travel_data(''your-user-uuid'') to create test data';
  RAISE NOTICE 'Use: SELECT public.cleanup_test_data(''your-user-uuid'') to clean up test data';
  RAISE NOTICE 'Use: SELECT * FROM public.get_user_stats(''your-user-uuid'') to check user statistics';
END $$;