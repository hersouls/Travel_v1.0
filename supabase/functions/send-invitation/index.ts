import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  travelPlanId: string;
  email: string;
  role: 'viewer' | 'editor';
  message?: string;
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Supabase 클라이언트 초기화
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 요청 데이터 파싱
    const { travelPlanId, email, role, message }: InvitationRequest = await req.json();

    // JWT 토큰에서 사용자 정보 추출
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: '인증되지 않은 사용자입니다.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 여행 계획 조회 및 권한 확인
    const { data: travelPlan, error: travelError } = await supabaseClient
      .from('travel_plans')
      .select('*')
      .eq('id', travelPlanId)
      .eq('user_id', user.id)
      .single();

    if (travelError || !travelPlan) {
      return new Response(
        JSON.stringify({ error: '여행 계획을 찾을 수 없거나 권한이 없습니다.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 이미 초대된 사용자인지 확인
    const { data: existingInvitation } = await supabaseClient
      .from('collaborators')
      .select('*')
      .eq('travel_plan_id', travelPlanId)
      .eq('email', email)
      .single();

    if (existingInvitation) {
      return new Response(
        JSON.stringify({ error: '이미 초대된 사용자입니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 초대 토큰 생성
    const invitationToken = crypto.randomUUID();

    // 협업자 테이블에 초대 정보 추가
    const { error: insertError } = await supabaseClient
      .from('collaborators')
      .insert({
        travel_plan_id: travelPlanId,
        email: email,
        role: role,
        status: 'pending',
        invitation_token: invitationToken,
      });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: '초대 정보 저장에 실패했습니다.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 이메일 내용 생성
    const invitationUrl = `${Deno.env.get('SITE_URL')}/invitation/${invitationToken}`;
    const emailSubject = `${user.user_metadata?.full_name || user.email}님이 여행 계획에 초대했습니다`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>여행 계획 초대</title>
          <style>
            body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌙 Moonwave Travel</h1>
              <p>여행 계획에 초대되었습니다!</p>
            </div>
            <div class="content">
              <h2>안녕하세요!</h2>
              <p><strong>${user.user_metadata?.full_name || user.email}</strong>님이 "${travelPlan.title}" 여행 계획에 ${role === 'editor' ? '편집자' : '구경꾼'}로 초대했습니다.</p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0;">📍 ${travelPlan.destination}</h3>
                <p><strong>기간:</strong> ${new Date(travelPlan.start_date).toLocaleDateString('ko-KR')} ~ ${new Date(travelPlan.end_date).toLocaleDateString('ko-KR')}</p>
                ${travelPlan.description ? `<p><strong>설명:</strong> ${travelPlan.description}</p>` : ''}
                ${message ? `<p><strong>초대 메시지:</strong> ${message}</p>` : ''}
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationUrl}" class="button">초대 수락하기</a>
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                이 초대는 7일 후 만료됩니다. 링크가 작동하지 않으면 URL을 복사하여 브라우저에 직접 붙여넣으세요:<br>
                <code style="background: #f3f4f6; padding: 2px 4px; border-radius: 3px;">${invitationUrl}</code>
              </p>
            </div>
            <div class="footer">
              <p>Moonwave Travel에서 발송된 메일입니다.</p>
              <p>문의사항이 있으시면 support@moonwave.kr로 연락해주세요.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // 이메일 발송 (Resend API 사용)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Moonwave Travel <noreply@moonwave.kr>',
        to: [email],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('이메일 발송 실패:', errorText);
      
      // 이메일 발송 실패 시 협업자 레코드 삭제
      await supabaseClient
        .from('collaborators')
        .delete()
        .eq('invitation_token', invitationToken);

      return new Response(
        JSON.stringify({ error: '이메일 발송에 실패했습니다.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '초대 이메일이 발송되었습니다.',
        invitationToken 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('서버 오류:', error);
    return new Response(
      JSON.stringify({ error: '서버 내부 오류가 발생했습니다.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});