import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

interface TravelLike {
  id: string;
  travel_plan_id: string;
  user_id: string;
  created_at: string;
}

interface UseTravelLikesReturn {
  likes: TravelLike[];
  likesCount: number;
  isLiked: boolean;
  isLoading: boolean;
  error: string | null;
  toggleLike: () => Promise<void>;
  refreshLikes: () => Promise<void>;
}

export function useTravelLikes(travelPlanId: string): UseTravelLikesReturn {
  const [likes, setLikes] = useState<TravelLike[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const supabase = createClient();

  // 현재 사용자가 좋아요 했는지 확인
  const isLiked = likes.some(like => like.user_id === user?.id);

  // 좋아요 목록 조회
  const fetchLikes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await (supabase as any)
        .from('travel_likes')
        .select('*')
        .eq('travel_plan_id', travelPlanId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setLikes(data || []);
      setLikesCount(data?.length || 0);
    } catch (err) {
      console.error('좋아요 목록 조회 오류:', err);
      setError(err instanceof Error ? err.message : '좋아요 목록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 좋아요 토글 (추가/제거)
  const toggleLike = async () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setError(null);

      if (isLiked) {
        // 좋아요 제거
        const { error: deleteError } = await (supabase as any)
          .from('travel_likes')
          .delete()
          .eq('travel_plan_id', travelPlanId)
          .eq('user_id', user.id);

        if (deleteError) {
          throw deleteError;
        }

        // 상태 업데이트 (옵티미스틱 업데이트)
        setLikes(prev => prev.filter(like => like.user_id !== user.id));
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // 좋아요 추가
        const { data, error: insertError } = await (supabase as any)
          .from('travel_likes')
          .insert({
            travel_plan_id: travelPlanId,
            user_id: user.id,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        // 상태 업데이트 (옵티미스틱 업데이트)
        setLikes(prev => [data, ...prev]);
        setLikesCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('좋아요 토글 오류:', err);
      setError(err instanceof Error ? err.message : '좋아요 처리 중 오류가 발생했습니다.');
      
      // 에러 발생 시 데이터 다시 조회하여 동기화
      await fetchLikes();
    }
  };

  // 실시간 구독 설정
  useEffect(() => {
    // 초기 데이터 로드
    fetchLikes();

    // 실시간 구독 설정
    const subscription = supabase
      .channel(`travel_likes:${travelPlanId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'travel_likes',
          filter: `travel_plan_id=eq.${travelPlanId}`,
        },
        (payload) => {
          console.log('좋아요 실시간 업데이트:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newLike = payload.new as TravelLike;
            setLikes(prev => {
              // 중복 방지
              if (prev.some(like => like.id === newLike.id)) {
                return prev;
              }
              return [newLike, ...prev];
            });
            setLikesCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            const deletedLike = payload.old as TravelLike;
            setLikes(prev => prev.filter(like => like.id !== deletedLike.id));
            setLikesCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [travelPlanId, fetchLikes, supabase]);

  return {
    likes,
    likesCount,
    isLiked,
    isLoading,
    error,
    toggleLike,
    refreshLikes: fetchLikes,
  };
}