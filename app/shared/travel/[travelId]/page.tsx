import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SharedTravelView } from '@/components/features/sharing/SharedTravelView'

interface SharedTravelPageProps {
  params: {
    travelId: string
  }
}

// 정적 내보내기를 위한 generateStaticParams 함수
export async function generateStaticParams() {
  // Static export compatibility - provide a placeholder
  // Actual routes will be handled dynamically at runtime
  return [{ travelId: 'placeholder' }]
}

export async function generateMetadata({ params }: SharedTravelPageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: travel } = await supabase
      .from('travel_plans')
      .select('title, description, start_date, end_date, destination')
      .eq('id', params.travelId)
      .eq('is_public', true)
      .single()

    if (!travel) {
      return {
        title: '여행 계획을 찾을 수 없습니다 | Moonwave Travel',
      }
    }

    const startDate = new Date(travel.start_date).toLocaleDateString('ko-KR')
    const endDate = new Date(travel.end_date).toLocaleDateString('ko-KR')

    return {
      title: `${travel.title} | Moonwave Travel`,
      description: travel.description || `${travel.destination}으로의 특별한 여행 (${startDate} - ${endDate})`,
      openGraph: {
        title: travel.title,
        description: travel.description || `${travel.destination}으로의 특별한 여행`,
        type: 'article',
        url: `/shared/travel/${params.travelId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: travel.title,
        description: travel.description || `${travel.destination}으로의 특별한 여행`,
      },
    }
  } catch {
    return {
      title: '여행 계획을 찾을 수 없습니다 | Moonwave Travel',
    }
  }
}

async function getSharedTravel(travelId: string) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Get travel plan
    const { data: travel, error: travelError } = await supabase
      .from('travel_plans')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        ),
        travel_days (
          *,
          day_plans (
            *
          )
        )
      `)
      .eq('id', travelId)
      .eq('is_public', true)
      .single()

    if (travelError || !travel) {
      return null
    }

    // Get collaborators
    const { data: collaborators } = await supabase
      .from('collaborators')
      .select('*')
      .eq('travel_plan_id', travelId)
      .eq('status', 'accepted')

    return {
      travel,
      collaborators: collaborators || []
    }
  } catch (error) {
    console.error('Get shared travel error:', error)
    return null
  }
}

export default async function SharedTravelPage({ params }: SharedTravelPageProps) {
  const data = await getSharedTravel(params.travelId)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedTravelView 
        travel={data.travel}
        collaborators={data.collaborators}
      />
    </div>
  )
}