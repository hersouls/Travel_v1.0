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
      .eq('id', params.travelId)
      .eq('is_public', true)
      .single();

    if (!travel) {
      return {
        title: '여행 계획을 찾을 수 없습니다 | Moonwave Travel',
      };
    }

    const startDate = new Date(travel.start_date).toLocaleDateString('ko-KR');
    const endDate = new Date(travel.end_date).toLocaleDateString('ko-KR');

    return {
      title: `${travel.title} | Moonwave Travel`,
      description:
        travel.description ||
        `${travel.destination}으로의 특별한 여행 (${startDate} - ${endDate})`,
      openGraph: {
        title: travel.title,
        description:
          travel.description || `${travel.destination}으로의 특별한 여행`,
        type: 'article',
        url: `/shared/travel/${params.travelId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: travel.title,
        description:
          travel.description || `${travel.destination}으로의 특별한 여행`,
      },
    };
  } catch {
    return {
      title: '여행 계획을 찾을 수 없습니다 | Moonwave Travel',
    };
  }
}

async function getSharedTravel(travelId: string) {
  const supabase = createServerSupabaseClient();

  try {
    // Get travel plan
    const { data: travel, error: travelError } = await supabase
      .from('travel_plans')
      .select(
        `
        *,
        profiles:user_id (
          name,
          avatar_url
        ),
        travel_days (
          *,
          day_plans (
            *
          )
        )
      `
      )
      .eq('id', travelId)
      .eq('is_public', true)
      .single();

    if (travelError || !travel) {
      return null;
    }

    // Get collaborators
    const { data: collaborators } = await supabase
      .from('collaborators')
      .select('*')
      .eq('travel_plan_id', travelId)
      .eq('status', 'accepted');

    return {
      travel,
      collaborators: collaborators || [],
    };
  } catch (error) {
    console.error('Get shared travel error:', error);
    return null;
  }
}

export default async function SharedTravelPage({
  params,
}: SharedTravelPageProps) {
  const data = await getSharedTravel(params.travelId);

  if (!data) {
    notFound();
  }

      return (
    <div className="min-h-screen bg-gray-50">
      <SharedTravelView
        travel={data.travel as any}
        collaborators={data.collaborators as any}
      />
    </div>
  );
}
