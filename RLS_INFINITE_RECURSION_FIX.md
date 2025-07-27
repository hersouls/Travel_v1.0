# RLS 무한 재귀 문제 해결 가이드

## 문제 설명

PostgreSQL의 Row Level Security (RLS)에서 발생하는 무한 재귀 문제는 주로 테이블 간의 순환 참조가 있을 때 발생합니다.

### 원인 분석

```sql
-- 문제가 되는 순환 참조 구조:
-- 1. travel_plans 테이블의 RLS 정책이 collaborators 테이블을 참조
CREATE POLICY "Users can manage own travel plans" ON public.travel_plans
  FOR ALL USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.collaborators  -- collaborators 테이블 참조
      WHERE travel_plan_id = travel_plans.id 
      AND user_id = auth.uid()
      AND joined_at IS NOT NULL
    )
  );

-- 2. collaborators 테이블의 RLS 정책이 travel_plans 테이블을 참조
CREATE POLICY "Travel owners can manage collaborators" ON public.collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans  -- travel_plans 테이블 참조
      WHERE id = collaborators.travel_plan_id 
      AND user_id = auth.uid()
    )
  );
```

이 구조에서 PostgreSQL이 RLS 정책을 평가할 때:
1. `travel_plans` 테이블 접근 시 `collaborators` 테이블을 확인
2. `collaborators` 테이블 접근 시 `travel_plans` 테이블을 확인
3. 무한 루프 발생

## 해결 방법

### 방법 1: collaborators 테이블 RLS 비활성화 (임시 해결책)

```sql
-- collaborators 테이블의 RLS를 임시로 비활성화
ALTER TABLE public.collaborators DISABLE ROW LEVEL SECURITY;
```

**장점:**
- 즉시 문제 해결
- 성능 향상
- 복잡한 정책 로직 불필요

**단점:**
- 데이터베이스 레벨 보안 약화
- 애플리케이션 레벨에서 보안 처리 필요

### 방법 2: 정책 단순화 (권장 해결책)

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Travel owners can manage collaborators" ON public.collaborators;

-- 단순화된 정책 생성
CREATE POLICY "Travel owners can manage collaborators" ON public.collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans
      WHERE id = collaborators.travel_plan_id
      AND user_id = auth.uid()
    )
  );

-- travel_plans 정책에서 collaborators 참조 제거
DROP POLICY IF EXISTS "Users can manage own travel plans" ON public.travel_plans;

CREATE POLICY "Users can manage own travel plans" ON public.travel_plans
  FOR ALL USING (auth.uid() = user_id);
```

**장점:**
- RLS 보안 유지
- 순환 참조 제거
- 명확한 권한 구조

**단점:**
- 협업자 기능 제한 (소유자만 관리 가능)

## 구현된 마이그레이션

### 1. `004_rls_infinite_recursion_fix.sql`
- collaborators 테이블 RLS 비활성화
- 다른 테이블 정책 단순화
- 성능 최적화 인덱스 추가

### 2. `005_rls_simplified_policies_only.sql`
- RLS 유지하면서 정책 단순화
- 순환 참조 완전 제거
- 보안성과 성능 균형

## 권장사항

### 즉시 적용 (프로덕션 환경)
```bash
# 방법 1: RLS 비활성화 (빠른 해결)
supabase db push --include-all

# 방법 2: 정책 단순화 (보안 유지)
# 005_rls_simplified_policies_only.sql 사용
```

### 장기적 해결책

1. **애플리케이션 레벨 보안 강화**
   ```typescript
   // collaborators 테이블 접근 시 애플리케이션 레벨 검증
   const canManageCollaborators = async (travelPlanId: string, userId: string) => {
     const travelPlan = await supabase
       .from('travel_plans')
       .select('user_id')
       .eq('id', travelPlanId)
       .single();
     
     return travelPlan?.user_id === userId;
   };
   ```

2. **데이터베이스 함수 활용**
   ```sql
   -- 보안 검증을 위한 함수 생성
   CREATE OR REPLACE FUNCTION can_manage_collaborators(travel_plan_id UUID)
   RETURNS BOOLEAN AS $$
   BEGIN
     RETURN EXISTS (
       SELECT 1 FROM public.travel_plans
       WHERE id = travel_plan_id
       AND user_id = auth.uid()
     );
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

3. **정기적인 보안 감사**
   - RLS 정책 복잡도 모니터링
   - 성능 영향 분석
   - 보안 취약점 점검

## 성능 최적화

### 인덱스 추가
```sql
-- collaborators 테이블 성능 최적화
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_joined ON public.collaborators(user_id, joined_at);
CREATE INDEX IF NOT EXISTS idx_collaborators_travel_user ON public.collaborators(travel_plan_id, user_id);
```

### 정책 최적화
```sql
-- 단순하고 효율적인 정책 사용
CREATE POLICY "Simple access policy" ON public.collaborators
  FOR ALL USING (auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.travel_plans
      WHERE id = collaborators.travel_plan_id
      AND user_id = auth.uid()
    )
  );
```

## 모니터링 및 디버깅

### RLS 정책 확인
```sql
-- 현재 RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 성능 모니터링
```sql
-- 느린 쿼리 확인
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE query LIKE '%collaborators%'
ORDER BY mean_time DESC;
```

## 결론

RLS 무한 재귀 문제는 복잡한 정책 구조에서 발생하는 일반적인 문제입니다. 제공된 해결책을 통해:

1. **즉시 문제 해결**: RLS 비활성화 또는 정책 단순화
2. **보안 유지**: 애플리케이션 레벨 보안 강화
3. **성능 최적화**: 적절한 인덱스와 정책 최적화
4. **장기적 안정성**: 정기적인 모니터링과 감사

이 가이드를 통해 안정적이고 보안적인 데이터베이스 환경을 구축할 수 있습니다.