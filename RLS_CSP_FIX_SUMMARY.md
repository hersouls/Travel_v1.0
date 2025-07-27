# RLS 무한 재귀 및 CSP 오류 해결 가이드

## 🔍 문제 분석

### 1. Supabase RLS 무한 재귀 오류
```
"데이터를 불러올 수 없습니다
여행 데이터 로딩 실패: infinite recursion detected in policy for relation "collaborators"
```

**원인**: `collaborators` 테이블의 RLS 정책에서 자기 참조로 인한 무한 재귀 발생

### 2. Content Security Policy (CSP) 오류
```
Refused to load the stylesheet 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css'
Refused to connect to 'wss://cihoeiwbiwcyrjywvufp.supabase.co/realtime/v1/websocket'
```

**원인**: CSP 정책에서 Pretendard 폰트와 Supabase WebSocket 연결이 차단됨

## 🛠️ 해결 방법

### 1. RLS 정책 수정

#### 방법 A: 임시 해결책 (권장)
```sql
-- collaborators 테이블의 RLS를 임시로 비활성화
ALTER TABLE public.collaborators DISABLE ROW LEVEL SECURITY;

-- 다른 테이블의 정책 단순화
DROP POLICY IF EXISTS "Users can manage own travel plans" ON public.travel_plans;
CREATE POLICY "Users can manage own travel plans" ON public.travel_plans
  FOR ALL USING (auth.uid() = user_id);
```

#### 방법 B: 근본적 해결책
```sql
-- 새로운 collaborators 정책 (무한 재귀 방지)
CREATE POLICY "Travel owners can manage collaborators" ON public.collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.travel_plans 
      WHERE id = collaborators.travel_plan_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can view own collaborations" ON public.collaborators
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. CSP 정책 수정

#### next.config.js 수정
```javascript
const cspDirectives = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://maps.googleapis.com https://maps.gstatic.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
  "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://*.supabase.co https://maps.googleapis.com wss://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].filter(Boolean).join('; ');
```

**주요 변경사항**:
- `style-src`에 `https://cdn.jsdelivr.net` 추가 (Pretendard 폰트)
- `font-src`에 `https://cdn.jsdelivr.net` 추가
- `connect-src`에 `wss://*.supabase.co` 추가 (WebSocket)

## 📋 적용 단계

### 1. Supabase 대시보드에서 SQL 실행
1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트 선택: `cihoeiwbiwcyrjywvufp`
3. SQL Editor에서 다음 SQL 실행:

```sql
-- collaborators 테이블 RLS 비활성화
ALTER TABLE public.collaborators DISABLE ROW LEVEL SECURITY;

-- travel_plans 정책 단순화
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
```

### 2. 개발 서버 재시작
```bash
npm run dev
```

## ✅ 확인사항

### 1. RLS 오류 해결 확인
- 브라우저 개발자 도구에서 "infinite recursion" 오류가 사라졌는지 확인
- 여행 데이터가 정상적으로 로드되는지 확인

### 2. CSP 오류 해결 확인
- Pretendard 폰트가 정상적으로 로드되는지 확인
- Supabase 실시간 연결이 정상 작동하는지 확인
- Google Maps 기능이 정상 작동하는지 확인

## 🔒 보안 고려사항

### 임시 해결책의 보안 영향
- `collaborators` 테이블의 RLS가 비활성화되어 보안이 약화됨
- 프로덕션 환경에서는 근본적 해결책 적용 권장

### 근본적 해결책 적용 시기
- 개발 및 테스트 완료 후
- 협업 기능이 안정적으로 작동하는지 확인 후
- 보안 검토 완료 후

## 📞 추가 지원

문제가 지속되는 경우:
1. Supabase 로그 확인
2. 브라우저 개발자 도구의 네트워크 탭 확인
3. 콘솔 오류 메시지 확인
4. 필요시 Supabase 지원팀 문의

---

**마지막 업데이트**: 2025-01-26
**적용 상태**: CSP 수정 완료, RLS 수정 대기 중