-- Restaurants 테이블 생성
-- 채식 식당 정보를 저장하는 테이블

CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ko TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('vegetarian', 'vegan', 'vegetarian-friendly')),
    address_en TEXT NOT NULL,
    address_ko TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    menu_items JSONB, -- Array of {name_en, name_ko, price}
    operating_hours JSONB, -- {mon: "11:00-22:00", tue: ..., sun: "closed"}
    price_range TEXT CHECK (price_range IN ('budget', 'mid-range', 'upscale')),
    description_en TEXT,
    description_ko TEXT,
    naver_place_id TEXT, -- For fetching Naver reviews (optional, for vegetarian-friendly restaurants)
    offers_side_dish_only BOOLEAN DEFAULT false, -- Restaurant offers side-dish-only orders
    ordering_tips_en TEXT, -- Tips for ordering in English
    ordering_tips_ko TEXT, -- Tips for ordering in Korean
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by UUID REFERENCES public.users(id),
    is_verified BOOLEAN DEFAULT false -- Admin verified
);

-- Restaurant Photos 테이블 생성
-- 식당 사진을 저장하는 테이블

CREATE TABLE IF NOT EXISTS public.restaurant_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL, -- Supabase Storage path
    caption_en TEXT,
    caption_ko TEXT,
    uploaded_by UUID REFERENCES public.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    photo_type TEXT DEFAULT 'restaurant' CHECK (photo_type IN ('restaurant', 'side_dish')) -- For side dish photos
);

-- Restaurant Side Dish Notes 테이블 생성
-- 식당의 반찬(사이드 디시) 정보를 저장하는 테이블

CREATE TABLE IF NOT EXISTS public.restaurant_side_dish_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    side_dish_name_ko TEXT NOT NULL,
    side_dish_name_en TEXT,
    description_en TEXT,
    description_ko TEXT,
    is_vegetarian BOOLEAN DEFAULT true,
    is_vegan BOOLEAN DEFAULT false,
    notes TEXT, -- Additional notes from user
    ordering_phrase_ko TEXT, -- How to order this dish in Korean
    ordering_phrase_en TEXT, -- English translation of ordering phrase
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    is_verified BOOLEAN DEFAULT false -- Admin verified
);

-- Restaurant Edit Suggestions 테이블 생성 (Post-MVP)
-- 사용자가 제안한 식당 정보 수정 사항을 저장하는 테이블

CREATE TABLE IF NOT EXISTS public.restaurant_edit_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    suggested_by UUID NOT NULL REFERENCES public.users(id),
    field_name TEXT NOT NULL, -- Which field is being edited
    old_value TEXT,
    new_value TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.restaurants OWNER TO postgres;
ALTER TABLE public.restaurant_photos OWNER TO postgres;
ALTER TABLE public.restaurant_side_dish_notes OWNER TO postgres;
ALTER TABLE public.restaurant_edit_suggestions OWNER TO postgres;

-- Row Level Security (RLS) 비활성화
-- 개발 단계에서는 RLS를 끄고, 프로덕션에서는 활성화하는 것을 권장합니다
ALTER TABLE public.restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_side_dish_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_edit_suggestions DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.restaurants TO anon;
GRANT ALL ON TABLE public.restaurants TO authenticated;
GRANT ALL ON TABLE public.restaurants TO service_role;

GRANT ALL ON TABLE public.restaurant_photos TO anon;
GRANT ALL ON TABLE public.restaurant_photos TO authenticated;
GRANT ALL ON TABLE public.restaurant_photos TO service_role;

GRANT ALL ON TABLE public.restaurant_side_dish_notes TO anon;
GRANT ALL ON TABLE public.restaurant_side_dish_notes TO authenticated;
GRANT ALL ON TABLE public.restaurant_side_dish_notes TO service_role;

GRANT ALL ON TABLE public.restaurant_edit_suggestions TO anon;
GRANT ALL ON TABLE public.restaurant_edit_suggestions TO authenticated;
GRANT ALL ON TABLE public.restaurant_edit_suggestions TO service_role;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON public.restaurants(category);
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON public.restaurants(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_restaurant_photos_restaurant_id ON public.restaurant_photos(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_side_dish_notes_restaurant_id ON public.restaurant_side_dish_notes(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_edit_suggestions_status ON public.restaurant_edit_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_edit_suggestions_restaurant_id ON public.restaurant_edit_suggestions(restaurant_id);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
-- 기존 트리거가 있으면 삭제 후 재생성
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_side_dish_notes_updated_at ON public.restaurant_side_dish_notes;
CREATE TRIGGER update_side_dish_notes_updated_at BEFORE UPDATE ON public.restaurant_side_dish_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

