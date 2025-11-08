
-- Progress Tracking 테이블 생성
-- 사용자 활동 및 통계 추적을 위한 테이블들

-- User Visits 테이블 생성
-- 사용자 세션 및 방문 추적
CREATE TABLE IF NOT EXISTS public.user_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL for anonymous users
    session_id TEXT NOT NULL, -- Browser session ID for anonymous tracking
    started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER, -- Calculated duration in seconds
    page_views INTEGER DEFAULT 0,
    restaurants_viewed INTEGER DEFAULT 0,
    searches_performed INTEGER DEFAULT 0,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Restaurant Views 테이블 생성
-- 식당 상세 페이지 조회 추적
CREATE TABLE IF NOT EXISTS public.restaurant_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL for anonymous users
    session_id TEXT NOT NULL, -- Browser session ID for anonymous tracking
    viewed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    view_duration_seconds INTEGER, -- Time spent viewing restaurant details
    source TEXT, -- 'map', 'search', 'direct', etc.
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Search Queries 테이블 생성
-- 검색 쿼리 추적
CREATE TABLE IF NOT EXISTS public.search_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- NULL for anonymous users
    session_id TEXT NOT NULL, -- Browser session ID for anonymous tracking
    query_text TEXT NOT NULL,
    filter_category TEXT, -- 'vegetarian', 'vegan', 'vegetarian-friendly', 'all'
    results_count INTEGER DEFAULT 0,
    searched_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.user_visits OWNER TO postgres;
ALTER TABLE public.restaurant_views OWNER TO postgres;
ALTER TABLE public.search_queries OWNER TO postgres;

-- Row Level Security (RLS) 비활성화 (개발 단계)
ALTER TABLE public.user_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.user_visits TO anon;
GRANT ALL ON TABLE public.user_visits TO authenticated;
GRANT ALL ON TABLE public.user_visits TO service_role;

GRANT ALL ON TABLE public.restaurant_views TO anon;
GRANT ALL ON TABLE public.restaurant_views TO authenticated;
GRANT ALL ON TABLE public.restaurant_views TO service_role;

GRANT ALL ON TABLE public.search_queries TO anon;
GRANT ALL ON TABLE public.search_queries TO authenticated;
GRANT ALL ON TABLE public.search_queries TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_visits_user_id ON public.user_visits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_visits_session_id ON public.user_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_user_visits_started_at ON public.user_visits(started_at);

CREATE INDEX IF NOT EXISTS idx_restaurant_views_restaurant_id ON public.restaurant_views(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_views_user_id ON public.restaurant_views(user_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_views_session_id ON public.restaurant_views(session_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_views_viewed_at ON public.restaurant_views(viewed_at);

CREATE INDEX IF NOT EXISTS idx_search_queries_user_id ON public.search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_session_id ON public.search_queries(session_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_searched_at ON public.search_queries(searched_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_query_text ON public.search_queries(query_text);

