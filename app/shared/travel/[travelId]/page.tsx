import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SharedTravelView } from '@/components/features/sharing/SharedTravelView';

interface SharedTravelPageProps {
  params: {
    travelId: string;
  };
}

// 정적 내보내기를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  // 빈 배열을 반환하여 모든 동적 라우트를 런타임에 처리
  // 실제로는 공개된 여행 계획 목록을 가져와서 미리 생성할 수 있음
  return [];
}

export async function generateMetadata({
  params,
}: SharedTravelPageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  try {
    const { data: travel } = await supabase
      .from('travel_plans')
      .select('title, description, start_date, end_date, destination')
      .eq('id', params.travelId as any)
      .eq('is_public', true as any)
      .single();

    if (!travel) {
      return {
        title: '여행 계획을 찾을 수 없습니다 | Moonwave Travel',
        description: '요청하신 여행 계획을 찾을 수 없습니다.',
      };
    }

    const title = `${(travel as any).title} | Moonwave Travel`;
    const description = 
      (travel as any).description || 
      `${(travel as any).destination}으로의 여행 계획 (${new Date((travel as any).start_date).toLocaleDateString('ko-KR')} ~ ${new Date((travel as any).end_date).toLocaleDateString('ko-KR')})`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: [
          {
            url: '/og-travel-plan.jpg',
            width: 1200,
            height: 630,
            alt: (travel as any).title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-travel-plan.jpg'],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 중 오류:', error);
    return {
      title: '여행 계획 | Moonwave Travel',
      description: '멋진 여행 계획을 공유합니다.',
    };
  }
}

export default async function SharedTravelPage({ params }: SharedTravelPageProps) {
  const supabase = createServerSupabaseClient();

  try {
    // 공개된 여행 계획과 관련 데이터 조회
    const { data: travel, error: travelError } = await supabase
      .from('travel_plans')
      .select(`
        *,
        profiles!travel_plans_user_id_fkey(
          full_name,
          avatar_url
        ),
        travel_days(
          id,
          day_number,
          day_plans(
            id,
            time,
            activity,
            location,
            notes,
            estimated_cost,
            latitude,
            longitude
          )
        )
      `)
      .eq('id', params.travelId as any)
      .eq('is_public', true as any)
      .single();

    if (travelError || !travel) {
      console.error('여행 계획 조회 오류:', travelError);
      notFound();
    }

    // 협업자 정보 조회
    const { data: collaborators = [] } = await supabase
      .from('collaborators')
      .select('*')
      .eq('travel_plan_id', params.travelId as any)
      .eq('status', 'accepted' as any);

    return (
      <div className="container mx-auto px-4 py-8">
        <SharedTravelView 
          travel={travel as any} 
          collaborators={collaborators as any} 
        />
      </div>
    );
  } catch (error) {
    console.error('페이지 로드 중 오류:', error);
    notFound();
  }
}
