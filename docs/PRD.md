# Product Requirements Document: NamoolNow

> **Note**: The following unrelated content was removed (translated for reference):
>
> - **Project Overview**: A web application that allows users to manage reading records
> - **Core Features**: Book search and addition, Reading progress tracking, Reading note writing, Statistics dashboard
> - **Data Model**: User, Book, ReadingLog tables
> - **UI/UX Requirements**: Mobile-first design, Dark mode support, Responsive layout
> - **Code Restriction**: If a file is more than 500 lines, separate to two files
>
> This content was unrelated to the NamoolNow project and has been removed.

## 1. Executive Summary

### 1.1 Product Vision

A bilingual (English/Korean) web application that helps overseas travelers find vegetarian, vegan, and vegetarian-friendly restaurants in Korea through an interactive map interface powered by Naver Maps API. The app includes real-time Naver review integration to identify restaurants with excellent vegetable side dishes (반찬), even if they're not fully vegetarian establishments.

### 1.2 Target Users

- **Primary**: Overseas travelers visiting Korea who follow vegetarian/vegan diets
- **Secondary**: Local residents seeking vegetarian options
- **Language**: English-first with Korean support

### 1.3 Core Value Proposition

Eliminate the language barrier and difficulty in finding vegetarian-friendly restaurants in Korea by providing a curated, map-based discovery experience with detailed restaurant information. Includes both dedicated vegetarian restaurants and non-vegetarian restaurants with excellent vegetable side dishes based on local reviews. Features a practical ordering guide with Korean phrases to help travelers communicate their dietary needs, enabling them to order vegetable-only dishes even at non-vegetarian restaurants.

---

## 2. Problem Statement

### 2.1 User Pain Points

- Difficulty finding vegetarian/vegan restaurants in Korea due to language barriers
- Lack of centralized, reliable information about vegetarian options
- Uncertainty about menu items and dietary restrictions
- No easy way to verify restaurant locations and accessibility
- Missing information about non-vegetarian restaurants that offer excellent vegetable side dishes (반찬)
- Not knowing how to order only side-dishies without the main dishes.

### 2.2 Market Opportunity

- Growing number of vegetarian/vegan travelers to Korea
- Increasing awareness of plant-based diets in Korea
- Gap in bilingual vegetarian restaurant resources
- Many Korean restaurants serve excellent vegetable side dishes that aren't captured in traditional vegetarian restaurant databases
- Restaurants' owners are willing to sell the side-dishes due to finance difficulty. They can create Bibimbob with the side-dishes which are made with vegetable only per customers' request in Korean.

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

- **Launch MVP**: Map view with 50+ verified restaurants in major Korean cities (Seoul, Busan)
- **User Engagement**: 1,000+ monthly active users within 3 months
- **Content Quality**: 90%+ restaurant entries with complete information (photos, hours, menu)
- **Coverage**: Include both dedicated vegetarian restaurants and vegetarian-friendly restaurants with good side dishes

### 3.2 Success Metrics

- **User Metrics**: Monthly active users, session duration, restaurants viewed per session
- **Content Metrics**: Total restaurants, restaurants with photos, restaurants with reviews, vegetarian-friendly restaurants identified
- **Quality Metrics**: User-reported accuracy rate, edit suggestion acceptance rate, Naver review relevance score

---

## 4. User Personas

### 4.1 Primary Persona: Sarah (Overseas Traveler)

- **Age**: 28
- **Location**: Visiting Seoul for 5 days
- **Diet**: Vegan
- **Tech Savviness**: High
- **Language**: English (limited Korean)
- **Goals**: Find vegan restaurants near her hotel, see menu items, check hours, discover restaurants with good vegetable side dishes
- **Pain Points**: Can't read Korean menus, unsure about ingredients, doesn't know which non-vegetarian restaurants have good vegetable options

### 4.2 Secondary Persona: Admin (Content Manager)

- **Role**: Content curator and moderator
- **Goals**: Add new restaurants, verify user suggestions, maintain data quality, identify vegetarian-friendly restaurants from Naver reviews
- **Pain Points**: Time-consuming manual data entry, need to verify accuracy, identifying good side dish options

---

## 5. User Stories

### 5.1 Map Browsing (MVP)

- **As a traveler**, I want to see vegetarian restaurants on a map so I can find options near my location
- **As a traveler**, I want to see vegetarian-friendly restaurants (with good side dishes) so I have more dining options
- **As a traveler**, I want to click on a restaurant marker to see basic information (name, type, address)
- **As a traveler**, I want to filter restaurants by type (vegetarian/vegan/vegetarian-friendly) so I can find suitable options

### 5.2 Restaurant Details (MVP)

- **As a traveler**, I want to see detailed restaurant information (menu, photos, hours, price range) so I can make informed decisions
- **As a traveler**, I want to see restaurant information in English so I can understand it without Korean language skills
- **As a traveler**, I want to see Naver reviews about vegetable side dishes so I know which non-vegetarian restaurants are vegetarian-friendly
- **As a traveler**, I want to see user notes about which side dishes are vegetarian so I can order confidently
- **As a traveler**, I want to know how to order vegetable-only Bibimbap (비빔밥) in Korean so I can request it at restaurants
- **As a traveler**, I want to see which restaurants offer side-dish-only options so I can plan my meals
- **As a traveler**, I want to see Korean phrases for ordering so I can communicate with restaurant staff

### 5.3 Content Contribution (Post-MVP)

- **As a user**, I want to suggest edits to restaurant information so I can help improve data accuracy
- **As a user**, I want to add notes about vegetarian side dishes at restaurants so I can help other travelers
- **As an admin**, I want to review and approve user suggestions so I can maintain quality

---

## 6. Features & Requirements

### 6.1 MVP Features (Phase 1)

#### 6.1.1 Map View

- **Naver Maps Integration**
  - Interactive map centered on Korea (default: Seoul)
  - Restaurant markers with custom icons (vegetarian/vegan/vegetarian-friendly distinction)
  - Click markers to show restaurant info card
  - Map controls: zoom, pan, current location (if permitted)
  - Responsive design (mobile + desktop)

#### 6.1.2 Restaurant Categories

- **Three Restaurant Types**:
  1. **Vegetarian**: Fully vegetarian menu
  2. **Vegan**: Fully vegan menu
  3. **Vegetarian-Friendly**: Non-vegetarian restaurants with excellent vegetable side dishes (반찬), identified through Naver reviews and user contributions

#### 6.1.3 Restaurant Information

- **Basic Info** (always visible)

  - Name (English + Korean)
  - Category: Vegetarian / Vegan / Vegetarian-Friendly
  - Address (English + Korean)
  - Coordinates (latitude, longitude)

- **Detailed Info** (in info card/modal)
  - Menu items (English + Korean)
  - Photos (multiple, user-uploaded)
  - Operating hours
  - Price range (budget-friendly / mid-range / upscale)
  - Reviews/ratings (future: user reviews)
  - **Naver Reviews Integration** (real-time, for vegetarian-friendly restaurants):
    - Display relevant Naver reviews filtered for vegetable/side dish keywords
    - Highlight reviews mentioning "반찬", "나물", "채소", "vegetable", "side dish"
    - Show review snippets (not stored in database, per Naver API terms)
  - **Side Dish Notes** (user-generated):
    - List of vegetarian side dishes available
    - User notes about which 반찬 are vegetarian
    - Photos of side dishes

#### 6.1.4 Filtering & Search

- Filter by category: All / Vegetarian / Vegan / Vegetarian-Friendly
- Search by restaurant name (English/Korean)
- Search by location/area (e.g., "Gangnam", "Hongdae")

#### 6.1.5 Language Support

- Bilingual interface (English primary, Korean secondary)
- Language toggle in navigation
- All restaurant data in both languages

#### 6.1.6 Ordering Guide (for Vegetarian-Friendly Restaurants)

- **Korean Phrases**: Common phrases for ordering vegetable-only dishes
  - "반찬만 주세요" (Just side dishes, please)
  - "채소만 있는 비빔밥 주세요" (Bibimbap with vegetables only, please)
  - "나물만 주세요" (Just seasoned vegetables, please)
  - "고기 없이 주세요" (Without meat, please)
- **Restaurant Service Indicator**: Badge showing if restaurant offers side-dish-only orders
- **Ordering Tips**: User-generated tips about how to order at specific restaurants
- **Phrase Display**: Show Korean phrase with pronunciation guide and English translation
- **Copy-to-Clipboard**: Allow users to copy Korean phrases to use in messaging apps or show to staff

### 6.2 Post-MVP Features (Phase 2+)

#### 6.2.1 User Contributions

- User account creation (Clerk authentication)
- Suggest new restaurant
- Suggest edits to existing restaurant
- Upload photos
- Add side dish notes and reviews
- Admin moderation workflow

#### 6.2.2 Enhanced Features

- User reviews and ratings
- Favorites/bookmarks
- Directions integration (Naver Maps directions)
- List view (alternative to map view)
- Advanced filters (price, rating, distance)
- Side dish photo gallery
- Progress tracking system (user visit tracking, restaurant views, search queries)
- Statistics dashboard (restaurant counts, category breakdown, user engagement metrics)
- Dark mode support

---

## 7. Technical Requirements

### 7.1 Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Authentication**: Clerk (already integrated)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for restaurant photos and side dish photos)
- **Maps**: Naver Maps API (Web SDK)
- **Reviews**: Naver Local API (real-time display only, no storage)
- **Deployment**: Vercel
- **Package Manager**: pnpm
- **Theme Management**: next-themes (for dark mode support)

### 7.2 Third-Party Services

- **Naver Maps API**: Map rendering, geocoding, reverse geocoding
- **Naver Local API**: Restaurant reviews (real-time display, compliant with terms of service)
- **Clerk**: User authentication (already set up)
- **Supabase**: Database and file storage (already set up)

### 7.3 Performance Requirements

- Map load time: < 3 seconds
- Restaurant data fetch: < 1 second
- Naver review fetch: < 2 seconds (real-time)
- Image optimization: WebP format, lazy loading
- Mobile-first responsive design

### 7.4 Legal Compliance

- **Naver API Terms**: Reviews displayed in real-time only, not stored in database
- **Data Privacy**: User-generated content complies with GDPR/Korean privacy laws
- **Content Moderation**: Admin review of user contributions

---

## 8. Data Model

### 8.1 Database Schema

#### 8.1.1 `restaurants` Table

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT false -- Admin verified
);
```

#### 8.1.2 `restaurant_photos` Table

```sql
CREATE TABLE restaurant_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Supabase Storage path
  caption_en TEXT,
  caption_ko TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  is_primary BOOLEAN DEFAULT false,
  photo_type TEXT DEFAULT 'restaurant' CHECK (photo_type IN ('restaurant', 'side_dish')) -- For side dish photos
);
```

#### 8.1.3 `restaurant_side_dish_notes` Table

```sql
CREATE TABLE restaurant_side_dish_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  side_dish_name_ko TEXT NOT NULL,
  side_dish_name_en TEXT,
  description_en TEXT,
  description_ko TEXT,
  is_vegetarian BOOLEAN DEFAULT true,
  is_vegan BOOLEAN DEFAULT false,
  notes TEXT, -- Additional notes from user
  ordering_phrase_ko TEXT, -- How to order this dish in Korean
  ordering_phrase_en TEXT, -- English translation of ordering phrase
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_verified BOOLEAN DEFAULT false -- Admin verified
);
```

#### 8.1.4 `restaurant_edit_suggestions` Table (Post-MVP)

```sql
CREATE TABLE restaurant_edit_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  suggested_by UUID NOT NULL REFERENCES users(id),
  field_name TEXT NOT NULL, -- Which field is being edited
  old_value TEXT,
  new_value TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 8.1.5 `user_visits` Table (Progress Tracking)

```sql
CREATE TABLE user_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('restaurant_view', 'search_query', 'page_view')),
  metadata JSONB, -- Additional data (search query, page path, etc.)
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 8.1.6 `restaurant_views` Table (Progress Tracking)

```sql
CREATE TABLE restaurant_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);
```

#### 8.1.7 `search_queries` Table (Progress Tracking)

```sql
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query_text TEXT NOT NULL,
  result_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 8.2 Storage Structure

- **Bucket**: `restaurant-photos`
- **Path Structure**:
  - Restaurant photos: `restaurants/{restaurant_id}/{photo_filename}`
  - Side dish photos: `restaurants/{restaurant_id}/side-dishes/{photo_filename}`
- **File Types**: JPG, PNG, WebP
- **Max File Size**: 5MB per image
- **RLS**: Public read, authenticated write (for user uploads)

### 8.3 Naver Reviews Integration (No Storage)

- **Real-Time API Calls**: Fetch reviews via Naver Local API when user views restaurant
- **Keyword Filtering**: Filter reviews for vegetable/side dish keywords:
  - Korean: "반찬", "나물", "채소", "야채", "무침", "볶음"
  - English: "vegetable", "side dish", "banchan", "namul"
- **Display Only**: Reviews shown in UI but never stored in database (per Naver API terms)
- **Caching Strategy**: Cache review data in browser session only (cleared on page refresh)

---

## 9. User Flows

### 9.1 MVP User Flow: Browse Restaurants

1. User lands on homepage (map view)
2. Map loads with restaurant markers (different icons for each category)
3. User zooms/pans to explore area
4. User clicks marker → Info card appears
5. User views restaurant details:
   - For vegetarian/vegan: Standard info (menu, photos, hours)
   - For vegetarian-friendly: Standard info + Naver reviews (filtered for side dishes) + side dish notes
6. User can filter by category or search by name/location

### 9.2 MVP User Flow: View Vegetarian-Friendly Restaurant

1. User clicks on "Vegetarian-Friendly" restaurant marker
2. Info card shows:
   - Restaurant basic info
   - Badge: "Good Vegetable Side Dishes (반찬)"
   - Service indicator: "Offers Side-Dish-Only Orders" (if applicable)
   - Real-time Naver reviews (filtered for vegetable/side dish mentions)
   - User-generated side dish notes (if available)
   - **Ordering Guide Section**:
     - Common Korean phrases for ordering
     - Restaurant-specific ordering tips (if available)
     - Copy-to-clipboard functionality for phrases
3. User can see which side dishes are vegetarian
4. User can copy Korean phrases to use when ordering
5. User can add their own side dish note (if authenticated)

### 9.3 Post-MVP User Flow: Add Side Dish Note

1. User views vegetarian-friendly restaurant
2. User clicks "Add Side Dish Note" (prompts sign-in if not authenticated)
3. User fills form:
   - Side dish name (Korean + English)
   - Is vegetarian? (checkbox)
   - Is vegan? (checkbox)
   - Notes/description
   - **Ordering phrase in Korean** (e.g., "이 반찬만 주세요")
   - **Ordering phrase in English** (translation)
   - Optional photo upload
4. User submits note
5. Admin reviews and approves/rejects
6. Approved note appears on restaurant page with ordering phrase

### 9.4 MVP User Flow: Use Ordering Guide

1. User views vegetarian-friendly restaurant
2. User scrolls to "How to Order" section
3. User sees common phrases:
   - "반찬만 주세요" (Just side dishes, please)
   - "채소만 있는 비빔밥 주세요" (Bibimbap with vegetables only, please)
4. User clicks "Copy" button next to phrase
5. Phrase is copied to clipboard
6. User can paste phrase in messaging app or show to restaurant staff
7. User sees restaurant-specific ordering tips (if available)

### 9.5 Post-MVP User Flow: Suggest Edit

1. User clicks "Suggest Edit" on restaurant page
2. User is prompted to sign in (if not authenticated)
3. User fills edit form (field + new value)
4. User submits suggestion
5. Admin reviews suggestion in admin panel
6. Admin approves/rejects → User notified

---

## 10. Design Considerations

### 10.1 UI/UX Principles

- **Mobile-first**: Optimized for travelers using phones
- **Clear visual hierarchy**: Map is primary, details secondary
- **Bilingual support**: Seamless language switching
- **Dark mode**: System preference detection with manual toggle
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast loading, smooth interactions

### 10.2 Visual Design

- **Color Scheme**: Green tones (vegetarian theme), clean and modern
- **Icons**: Custom markers for each category:
  - Vegetarian: Green leaf icon
  - Vegan: Different green icon (e.g., double leaf)
  - Vegetarian-Friendly: Green leaf with small dish icon
- **Typography**: Clear, readable fonts (English + Korean)
- **Components**: shadcn/ui for consistency
- **Badges**: "Vegetarian-Friendly" badge with 반찬 icon
- **Service Badges**: "Offers Side-Dish-Only Orders" badge for restaurants that accommodate this

### 10.3 Map Design

- **Default View**: Seoul city center
- **Marker Styles**:
  - Vegetarian: Green leaf icon
  - Vegan: Different green icon (e.g., double leaf)
  - Vegetarian-Friendly: Green leaf with dish icon
- **Info Cards**: Slide-up from bottom (mobile), popup (desktop)
- **Review Display**: Collapsible section showing filtered Naver reviews

### 10.4 Review Display Design

- **Section Header**: "Local Reviews About Side Dishes (반찬)"
- **Review Cards**:
  - Show review snippet (first 100 characters)
  - Highlight keywords (vegetable, 반찬, etc.)
  - Show reviewer rating (if available)
  - Link to full Naver review (external)
- **Disclaimer**: "Reviews from Naver (displayed in real-time)"

### 10.5 Ordering Guide Design

- **Section Header**: "How to Order (주문 방법)"
- **Phrase Cards**:
  - Korean phrase (large, readable font)
  - English translation
  - Pronunciation guide (optional, romanized)
  - Copy button (icon + "Copy" text)
  - Visual feedback when copied (checkmark, toast notification)
- **Restaurant-Specific Tips**: Collapsible section with user-generated ordering tips
- **Visual Hierarchy**: Ordering guide prominently displayed for vegetarian-friendly restaurants

### 10.6 Progress Tracking Design

- **User Progress Display**: Show user engagement metrics (restaurants viewed, searches performed)
- **Visual Indicators**: Progress bars or badges showing exploration milestones
- **Privacy**: Track anonymously for unauthenticated users, personalized for authenticated users
- **Dashboard Integration**: Progress data feeds into admin statistics dashboard

### 10.7 Statistics Dashboard Design

- **Admin Dashboard**: Overview of key metrics
- **Visual Charts**: Restaurant counts by category, user engagement trends
- **Key Metrics Display**:
  - Total restaurants count
  - Restaurants with photos
  - Vegetarian-friendly restaurants
  - User contributions count
  - Search query analytics
- **Responsive Layout**: Dashboard optimized for desktop and tablet viewing

---

## 11. Implementation Phases

### 11.1 Phase 1: MVP (Weeks 1-4)

**Goal**: Launch map view with 50+ restaurants including vegetarian-friendly options

**Tasks**:

1. Set up Naver Maps API integration
2. Set up Naver Local API for reviews (real-time display)
3. Create database schema (restaurants, restaurant_photos, restaurant_side_dish_notes)
4. Build map component with markers (3 different types)
5. Build restaurant info card/modal with review section
6. Implement Naver review filtering (keyword-based)
7. Implement filtering and search (by category)
8. Add bilingual support (language toggle)
9. Build ordering guide component with Korean phrases
10. Implement copy-to-clipboard functionality for phrases
11. Admin panel for adding restaurants (basic)
12. Seed initial data (50 restaurants: mix of vegetarian, vegan, vegetarian-friendly)

**Deliverables**:

- Working map with restaurant markers (3 categories)
- Clickable markers showing restaurant details
- Real-time Naver reviews for vegetarian-friendly restaurants
- Filter by category (vegetarian/vegan/vegetarian-friendly)
- Search functionality
- Bilingual interface
- Ordering guide with Korean phrases and copy functionality

### 11.2 Phase 2: Content Management (Weeks 5-6)

**Goal**: Enable user contributions with moderation

**Tasks**:

1. Build user authentication flow (Clerk integration)
2. Create "Add Side Dish Note" form (including ordering phrases)
3. Create "Suggest Edit" form
4. Build admin moderation panel
5. Implement edit suggestion workflow
6. Add photo upload functionality (restaurant + side dish photos)
7. Allow users to add restaurant-specific ordering tips

**Deliverables**:

- User sign-in/sign-up
- Side dish note submission
- Edit suggestion system
- Admin approval workflow
- Photo uploads (restaurant and side dishes)

### 11.3 Phase 3: Enhancements (Weeks 7-8+)

**Goal**: Add reviews, favorites, directions, progress tracking, statistics, dark mode

**Tasks**:

1. User reviews and ratings
2. Favorites/bookmarks
3. Directions integration (Naver Maps)
4. List view alternative
5. Advanced filters (price, rating, distance)
6. Side dish photo gallery
7. Progress tracking system (user visits, restaurant views, search queries)
8. Statistics dashboard (admin panel)
9. Dark mode implementation (next-themes integration)

---

## 12. Risks & Dependencies

### 12.1 Technical Risks

- **Naver Maps API**: Rate limits, API key management, documentation in Korean
- **Naver Local API**: Review data access, API availability, rate limits
- **Data Quality**: Ensuring accurate restaurant information
- **Performance**: Map rendering with many markers, real-time review fetching
- **Review Filtering**: Accuracy of keyword-based filtering for side dish mentions

### 12.2 Business Risks

- **Content Volume**: Need sufficient restaurants to be useful
- **Maintenance**: Keeping restaurant data up-to-date
- **Competition**: Existing apps (HappyCow, etc.)
- **Naver API Changes**: Terms of service changes affecting review access

### 12.3 Dependencies

- Naver Maps API approval and setup
- Naver Local API approval and setup (for reviews)
- Initial restaurant data collection (manual or scraping)
- Admin time for content moderation
- Identifying vegetarian-friendly restaurants from Naver reviews

### 12.4 Mitigation Strategies

- Start with manual data entry for MVP
- Implement caching for map data (browser session)
- Plan for scalable content management system
- Consider partnerships with vegetarian communities
- Monitor Naver API terms for changes
- Build fallback if Naver review API becomes unavailable

---

## 13. Success Criteria

### 13.1 Launch Criteria

- [ ] 50+ restaurants in database (mix of all three categories)
- [ ] All restaurants have: name (EN/KO), address, coordinates, category
- [ ] 80%+ restaurants have: photos, menu, hours
- [ ] Vegetarian-friendly restaurants have: Naver review integration working
- [ ] Map loads in < 3 seconds
- [ ] Bilingual interface working
- [ ] Mobile responsive
- [ ] Real-time Naver reviews displaying correctly (no storage)
- [ ] Ordering guide with Korean phrases working
- [ ] Copy-to-clipboard functionality for phrases

### 13.2 Post-Launch Criteria (3 months)

- [ ] 1,000+ monthly active users
- [ ] 200+ restaurants in database
- [ ] 50+ vegetarian-friendly restaurants with side dish notes
- [ ] Average session duration > 2 minutes
- [ ] User satisfaction score > 4.0/5.0
- [ ] Naver review integration working reliably

---

## 14. Open Questions & Decisions Needed

1. **Naver Maps API**: Need to confirm API key setup process and pricing
2. **Naver Local API**: Need to confirm review data access and API availability
3. **Initial Data**: How to collect first 50 restaurants? (Manual entry vs. data source)
4. **Photo Sources**: Use restaurant photos from Google/Naver or require original uploads?
5. **Admin Access**: Who will be admin? How to manage admin permissions?
6. **Domain Name**: What domain will be used? (affects deployment)
7. **Review Filtering**: What keywords to use for filtering side dish mentions? (Need to refine list)
8. **Vegetarian-Friendly Criteria**: What makes a restaurant "vegetarian-friendly"? (Number of reviews mentioning side dishes? Admin judgment?)
9. **Ordering Phrases**: What are the most essential Korean phrases to include? (Start with basic set, expand based on user feedback)
10. **Restaurant Service Verification**: How to verify which restaurants actually offer side-dish-only orders? (Admin research, user reports, restaurant partnerships?)

---

## 15. Next Steps

1. **Immediate**: Review and approve this PRD
2. **Week 1**: Set up Naver Maps API account and get API keys
3. **Week 1**: Set up Naver Local API account and get API keys (for reviews)
4. **Week 1**: Design database schema and create migrations
5. **Week 1**: Begin collecting initial restaurant data (50 restaurants, including vegetarian-friendly)
6. **Week 2**: Start development with map integration
7. **Week 2**: Implement Naver review filtering logic

---

## Appendix A: File Structure

```
app/
  ├── page.tsx                    # Homepage (map view)
  ├── restaurants/
  │   └── [id]/
  │       └── page.tsx           # Restaurant detail page
  ├── admin/                      # Admin panel (protected)
  │   ├── restaurants/
  │   │   ├── page.tsx           # List restaurants
  │   │   ├── new/
  │   │   │   └── page.tsx      # Add new restaurant
  │   │   └── [id]/
  │   │       └── edit/
  │   │           └── page.tsx  # Edit restaurant
  │   └── suggestions/
  │       └── page.tsx          # Review edit suggestions

components/
  ├── map/
  │   ├── naver-map.tsx         # Naver Maps wrapper
  │   ├── restaurant-marker.tsx # Custom marker component (3 types)
  │   └── restaurant-info-card.tsx # Info popup with review section
  ├── restaurants/
  │   ├── restaurant-card.tsx
  │   ├── restaurant-filters.tsx
  │   ├── restaurant-search.tsx
  │   ├── naver-reviews.tsx     # Naver review display component
  │   ├── side-dish-notes.tsx   # Side dish notes component
  │   └── ordering-guide.tsx   # Ordering guide component with phrases
  ├── reviews/
  │   └── review-filter.tsx     # Keyword filtering for reviews

actions/
  ├── restaurants.ts            # Server actions for restaurants
  ├── suggestions.ts            # Server actions for edit suggestions
  └── side-dishes.ts           # Server actions for side dish notes

lib/
  ├── naver-maps.ts             # Naver Maps API client
  ├── naver-local.ts            # Naver Local API client (reviews)
  └── i18n.ts                   # Internationalization utilities

types/
  └── restaurant.ts             # TypeScript types

supabase/migrations/
  └── YYYYMMDDHHmmss_create_restaurants_schema.sql
```

---

## Appendix B: Naver Review Integration Details

### B.1 API Usage

- **Endpoint**: Naver Local API (restaurant reviews)
- **Authentication**: API key required
- **Rate Limits**: Check Naver API documentation
- **Data Usage**: Real-time display only, no storage (per terms of service)

### B.2 Keyword Filtering

**Korean Keywords**:

- 반찬 (side dishes)
- 나물 (seasoned vegetables)
- 채소 (vegetables)
- 야채 (vegetables)
- 무침 (seasoned salad)
- 볶음 (stir-fried)
- 샐러드 (salad)

**English Keywords**:

- vegetable
- side dish
- banchan
- namul
- salad

### B.3 Review Display Logic

1. Fetch reviews from Naver Local API (real-time)
2. Filter reviews containing keyword matches
3. Sort by relevance (number of keyword matches)
4. Display top 5-10 most relevant reviews
5. Highlight matched keywords in review text
6. Show disclaimer: "Reviews from Naver (displayed in real-time)"

### B.4 Error Handling

- If Naver API unavailable: Show message, allow user-generated content only
- If no reviews found: Show "No reviews mentioning side dishes found"
- If rate limit exceeded: Cache last successful fetch, show cached data with timestamp

---

**Document Version**: 2.2  
**Last Updated**: 2025-01-11  
**Owner**: Product Manager  
**Status**: Draft - Pending Approval

**Key Changes from v1.0**:

- Added "Vegetarian-Friendly" restaurant category
- Integrated Naver review real-time display
- Added side dish notes feature
- **Added ordering guide/phrasebook feature (core differentiator)**
- Updated database schema with ordering-related fields
- Added review filtering logic
- Updated user flows and features

**Key Changes from v2.0**:

- Added ordering guide as core MVP feature
- Added Korean phrase library with copy-to-clipboard functionality
- Added restaurant service indicator (offers side-dish-only orders)
- Updated database schema to include ordering tips and phrases
- Added ordering guide to user flows and design considerations

**Key Changes from v2.1**:

- Added progress tracking system (user visits, restaurant views, search queries)
- Added statistics dashboard for admin panel
- Added dark mode support (next-themes integration)
- Updated database schema with progress tracking tables
- Added progress tracking and statistics to design considerations
