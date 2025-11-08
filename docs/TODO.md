# TODO: NamoolNow - Implementation Roadmap

**Last Updated**: 2025-01-11  
**Status**: Core MVP Complete - Ready for Setup & Testing

---

## 📋 Table of Contents

- [Quick Status Overview](#quick-status-overview)
- [Phase 1: Foundation Setup (Manual + Database)](#phase-1-foundation-setup-manual--database) - ⚠️ **BLOCKED** (Manual Setup Required)
- [Phase 2: Testing Existing Features](#phase-2-testing-existing-features) - ⚠️ **BLOCKED** (Requires Phase 1)
- [Phase 3: Progress Tracking System](#phase-3-progress-tracking-system) - 📋 **NOT STARTED**
- [Phase 4: Statistics Dashboard](#phase-4-statistics-dashboard) - 📋 **NOT STARTED**
- [Phase 5: Dark Mode](#phase-5-dark-mode) - 📋 **NOT STARTED**
- [Phase 6: Data Seeding & Production Prep](#phase-6-data-seeding--production-prep) - 📋 **NOT STARTED**
- [Phase 7: Deployment & Launch](#phase-7-deployment--launch) - 📋 **NOT STARTED**
- [Future Enhancements](#future-enhancements)
- [Code Quality Improvements](#code-quality-improvements)

---

## Quick Status Overview

### What's Completed ✅

- ✅ **Project Setup**: Next.js 15, Clerk, Supabase, TypeScript, Tailwind CSS
- ✅ **Database Schema**: Migration files created for all tables
- ✅ **Map Components**: Naver Maps integration structure complete
- ✅ **Restaurant CRUD**: Full admin panel for restaurant management
- ✅ **UI Components**: All core components built (map, cards, filters, search)
- ✅ **Ordering Guide**: Korean phrases with copy-to-clipboard
- ✅ **Responsive Design**: Mobile-first layout implemented
- ✅ **Bilingual Support**: English/Korean language toggle

### What's Next 🎯

1. **Phase 1** (⚠️ BLOCKED): Run database migration and setup API keys
2. **Phase 2** (⚠️ BLOCKED): Test all features with real data
3. **Phase 3** (📋 READY): Build progress tracking system
4. **Phase 4** (📋 READY): Build statistics dashboard
5. **Phase 5** (📋 READY): Implement dark mode

### Current Blockers ⚠️

All manual setup tasks MUST be completed before testing:

1. ⚠️ Run database migration in Supabase Dashboard
2. ⚠️ Get Naver Maps API keys
3. ⚠️ Get Naver Local API keys (for reviews)
4. ⚠️ Create Storage bucket `restaurant-photos` in Supabase

---

## Phase 1: Foundation Setup (Manual + Database)

**Status**: ⚠️ **BLOCKED** - Manual setup required  
**Estimated Time**: 1-2 hours  
**Prerequisites**: Supabase account, Naver Cloud Platform account  
**Must Complete Before**: Phase 2 (testing)

This phase groups all manual configuration tasks that block testing and further development.

### 1.1 Database Migration ⚠️ **CRITICAL - DO THIS FIRST**

**Status**: Migration file ready, needs execution

- [x] Create migration file: `20251107142116_create_restaurants_schema.sql`
- [ ] **Run migration in Supabase** ⚠️ **MANUAL STEP REQUIRED**
  1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project
  2. Click "SQL Editor" in left sidebar
  3. Open `supabase/migrations/20251107142116_create_restaurants_schema.sql`
  4. Copy entire SQL content
  5. Paste into SQL Editor
  6. Click "Run" button
  7. Verify no errors in output
- [ ] Verify tables created correctly
  - [ ] Check `restaurants` table exists
  - [ ] Check `restaurant_photos` table exists
  - [ ] Check `restaurant_side_dish_notes` table exists
  - [ ] Check `restaurant_edit_suggestions` table exists
  - [ ] Check `users` table exists
- [ ] Test RLS policies (if enabled)
  - [ ] Try inserting test data
  - [ ] Try querying data

**Why this is first**: All testing and development depends on database tables existing.

---

### 1.2 Supabase Storage Bucket Setup ⚠️ **REQUIRED FOR PHOTO UPLOADS**

**Status**: Not created

- [ ] Create Storage bucket `restaurant-photos`
  1. Go to Supabase Dashboard → Storage
  2. Click "New bucket"
  3. Name: `restaurant-photos`
  4. Public bucket: Yes (for public read access)
  5. Click "Create bucket"
- [ ] Configure RLS policies for bucket

  ```sql
  -- Allow public read access
  CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-photos');

  -- Allow authenticated users to upload
  CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'restaurant-photos'
    AND auth.role() = 'authenticated'
  );

  -- Allow authenticated users to update their own uploads
  CREATE POLICY "Users can update own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'restaurant-photos'
    AND auth.role() = 'authenticated'
  );

  -- Allow authenticated users to delete their own uploads
  CREATE POLICY "Users can delete own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'restaurant-photos'
    AND auth.role() = 'authenticated'
  );
  ```

- [ ] Test bucket access
  - [ ] Try uploading a test image via admin panel
  - [ ] Verify public URL works

**Why this matters**: Photo upload component will fail without this bucket.

---

### 1.3 Naver Maps API Setup ⚠️ **REQUIRED FOR MAP DISPLAY**

**Status**: Component ready, no API keys

- [ ] Create Naver Cloud Platform account
  1. Go to [Naver Cloud Platform](https://www.ncloud.com/)
  2. Sign up or log in
  3. Complete identity verification (may require Korean phone number)
- [ ] Apply for Maps API access
  1. Go to Console → Services → AI·NAVER API → Maps
  2. Click "Application" or "이용 신청"
  3. Fill out application form
  4. Wait for approval (usually instant)
- [ ] Get API keys (Client ID, Client Secret)
  1. After approval, go to "Application registration" or "애플리케이션 등록"
  2. Create new application
  3. Service: Web Dynamic Map
  4. Copy Client ID
  5. Copy Client Secret (if required)
- [ ] Add to environment variables
  ```bash
  # Add to .env.local
  NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=your_client_id_here
  NEXT_PUBLIC_NAVER_MAPS_CLIENT_SECRET=your_client_secret_here # if required
  ```
- [ ] Update `.env.example` with new variables (without values)

**Why this matters**: Map component will not load without valid API keys.

---

### 1.4 Naver Local API Setup ⚠️ **REQUIRED FOR REVIEWS**

**Status**: Component ready, no API keys

- [ ] Apply for Naver Local API access
  1. Go to Naver Developers Console
  2. Create new application (or use existing)
  3. Enable "Local" API
  4. Get API key
- [ ] Add to environment variables
  ```bash
  # Add to .env.local
  NAVER_LOCAL_API_KEY=your_api_key_here
  NAVER_LOCAL_API_SECRET=your_api_secret_here # if required
  ```
- [ ] Update `.env.example` with new variables (without values)
- [ ] Test API access
  - [ ] Make a test API call to verify credentials work
  - [ ] Check rate limits and quotas

**Why this matters**: Naver reviews feature will show placeholder data without this.

---

### 1.5 Environment Variables Verification

**Status**: Partial - needs API keys

- [x] `.env.example` exists
- [x] Clerk keys configured
- [x] Supabase keys configured
- [ ] Naver Maps keys added
- [ ] Naver Local API keys added
- [ ] Storage bucket name configured
- [ ] Verify all keys are valid
  - [ ] Test Clerk authentication
  - [ ] Test Supabase connection
  - [ ] Test Naver Maps API
  - [ ] Test Naver Local API

**Checklist for `.env.local`**:

```bash
# Clerk (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Storage (add this)
NEXT_PUBLIC_STORAGE_BUCKET=restaurant-photos

# Naver Maps (add these)
NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=your_client_id
NEXT_PUBLIC_NAVER_MAPS_CLIENT_SECRET=your_secret # if required

# Naver Local API (add these)
NAVER_LOCAL_API_KEY=your_api_key
NAVER_LOCAL_API_SECRET=your_api_secret # if required
```

---

### Phase 1 Completion Checklist

Before moving to Phase 2, verify:

- [ ] ✅ Database migration executed successfully
- [ ] ✅ All tables exist in Supabase
- [ ] ✅ Storage bucket created and accessible
- [ ] ✅ Naver Maps API keys obtained and added to .env
- [ ] ✅ Naver Local API keys obtained and added to .env
- [ ] ✅ All environment variables configured
- [ ] ✅ Test Supabase connection works
- [ ] ✅ Restart dev server to load new env vars

**Once Phase 1 is complete, you can proceed to Phase 2 for testing!**

---

## Phase 2: Testing Existing Features

**Status**: ⚠️ **BLOCKED** - Waiting for Phase 1  
**Estimated Time**: 2-3 hours  
**Prerequisites**: Phase 1 complete (database + API keys)  
**Must Complete Before**: Phase 3 (new features)

This phase tests all built features with real data to ensure everything works correctly.

### 2.1 Database & Authentication Testing

- [ ] Test Clerk authentication flow
  - [ ] Sign up new user
  - [ ] Sign in existing user
  - [ ] Sign out
  - [ ] Verify user sync to Supabase `users` table
  - [ ] Check user appears in Supabase dashboard
- [ ] Test protected routes
  - [ ] Try accessing `/admin` without login → should redirect
  - [ ] Sign in and access `/admin` → should work
  - [ ] Verify middleware protection working

---

### 2.2 Map & Restaurant Display Testing

- [ ] Test map loading and rendering
  - [ ] Homepage loads without errors
  - [ ] Map displays centered on Seoul
  - [ ] No API key errors in console
  - [ ] Map controls work (zoom in/out, pan)
- [ ] Test current location feature
  - [ ] Click "Current Location" button
  - [ ] Grant location permission
  - [ ] Map centers on your location
- [ ] Test restaurant markers (after adding test data)
  - [ ] Markers display on map
  - [ ] Different icons for vegetarian/vegan/vegetarian-friendly
  - [ ] Click marker → info card appears
  - [ ] Info card shows correct data

---

### 2.3 Restaurant CRUD Testing (Admin Panel)

- [ ] Test restaurant creation
  - [ ] Go to `/admin/restaurants/new`
  - [ ] Fill out form with test data
  - [ ] Submit form
  - [ ] Verify restaurant appears in database
  - [ ] Verify restaurant appears on map
- [ ] Test restaurant editing
  - [ ] Go to `/admin/restaurants`
  - [ ] Click "Edit" on a restaurant
  - [ ] Modify data
  - [ ] Save changes
  - [ ] Verify updates in database
  - [ ] Verify updates on map
- [ ] Test restaurant deletion
  - [ ] Delete a test restaurant
  - [ ] Verify removed from database
  - [ ] Verify removed from map
- [ ] Test form validation
  - [ ] Try submitting empty form → should show errors
  - [ ] Try invalid coordinates → should show error
  - [ ] Verify all required fields enforced

---

### 2.4 Photo Upload Testing

- [ ] Test photo upload to Supabase Storage
  - [ ] Upload restaurant photo via admin panel
  - [ ] Verify file appears in Storage bucket
  - [ ] Verify public URL works
  - [ ] Check photo displays on restaurant card
- [ ] Test file type restrictions
  - [ ] Try uploading JPG → should work
  - [ ] Try uploading PNG → should work
  - [ ] Try uploading WebP → should work
  - [ ] Try uploading invalid type → should reject
- [ ] Test file size limit
  - [ ] Try uploading >5MB file → should reject
  - [ ] Verify error message shows

---

### 2.5 Search & Filter Testing

- [ ] Test category filtering
  - [ ] Filter by "All" → shows all restaurants
  - [ ] Filter by "Vegetarian" → shows only vegetarian
  - [ ] Filter by "Vegan" → shows only vegan
  - [ ] Filter by "Vegetarian-Friendly" → shows only friendly
  - [ ] Map updates markers correctly
- [ ] Test search functionality
  - [ ] Search by restaurant name (English) → finds matches
  - [ ] Search by restaurant name (Korean) → finds matches
  - [ ] Search by location/area → finds matches
  - [ ] No results → shows "No results found"

---

### 2.6 Restaurant Detail Page Testing

- [ ] Test detail page display
  - [ ] Click restaurant marker → info card opens
  - [ ] Click "View Details" → goes to `/restaurants/[id]`
  - [ ] All sections display correctly:
    - [ ] Basic info (name, category, address)
    - [ ] Photos gallery
    - [ ] Operating hours
    - [ ] Menu items
    - [ ] Ordering guide
    - [ ] Side dish notes (if available)
- [ ] Test Naver reviews (for vegetarian-friendly)
  - [ ] Reviews section appears
  - [ ] Reviews load from API (or show placeholder)
  - [ ] Keywords highlighted in reviews
  - [ ] Disclaimer text visible

---

### 2.7 Ordering Guide Testing

- [ ] Test phrase display
  - [ ] Korean phrases display correctly
  - [ ] English translations visible
  - [ ] Pronunciation guides readable
- [ ] Test copy-to-clipboard functionality
  - [ ] Click "Copy" button
  - [ ] Verify text copied (paste in notepad)
  - [ ] Visual feedback shown (checkmark)
  - [ ] Test on mobile device
  - [ ] Test on desktop

---

### 2.8 Bilingual Support Testing

- [ ] Test language toggle
  - [ ] Click language toggle in nav
  - [ ] UI switches to Korean
  - [ ] Restaurant data shows Korean names
  - [ ] Click toggle again → switches back to English
- [ ] Test language persistence
  - [ ] Select Korean
  - [ ] Refresh page → should stay Korean
  - [ ] Close browser → open again → should remember choice
- [ ] Verify all UI elements translated
  - [ ] Navigation
  - [ ] Buttons
  - [ ] Form labels
  - [ ] Error messages
  - [ ] Info card sections

---

### 2.9 Responsive Design Testing

- [ ] Test on mobile devices
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] Map displays correctly
  - [ ] Info card slides up from bottom
  - [ ] Forms usable on mobile
  - [ ] Touch interactions work
- [ ] Test on tablet
  - [ ] iPad (Safari)
  - [ ] Android tablet
  - [ ] Layout adapts correctly
- [ ] Test on desktop
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
  - [ ] Info card appears as popup

---

### 2.10 Admin Access Control Testing

- [ ] Add admin role check to admin routes
  - [ ] Implement Clerk role verification
  - [ ] Non-admin users can't access `/admin`
  - [ ] Show "Access Denied" message
- [ ] Test moderation panel
  - [ ] Create test edit suggestion
  - [ ] View in `/admin/suggestions`
  - [ ] Approve suggestion → updates restaurant
  - [ ] Reject suggestion → no changes

---

### Phase 2 Completion Checklist

Before moving to Phase 3, verify:

- [ ] ✅ All existing features tested and working
- [ ] ✅ No critical bugs found
- [ ] ✅ Map displays correctly with API keys
- [ ] ✅ Restaurant CRUD operations work
- [ ] ✅ Photo uploads work
- [ ] ✅ Search and filtering work
- [ ] ✅ Ordering guide copy feature works
- [ ] ✅ Bilingual toggle works
- [ ] ✅ Responsive on mobile/tablet/desktop
- [ ] ✅ Admin access control implemented

**Once Phase 2 is complete, you can start building new features!**

---

## Phase 3: Progress Tracking System

**Status**: 📋 **NOT STARTED** - Ready to implement  
**Estimated Time**: 4-6 hours  
**Prerequisites**: Phase 1 complete (database access)  
**Deliverables**: User visit tracking, restaurant views, search analytics

### 3.1 Database Schema for Progress Tracking

- [ ] Review PRD requirements for tracking
  - [ ] User visit tracking (page views)
  - [ ] Restaurant view tracking (which restaurants users view)
  - [ ] Search query tracking (what users search for)
- [ ] Create migration file: `YYYYMMDDHHmmss_create_progress_tracking.sql`
- [ ] Add `user_visits` table
  ```sql
  CREATE TABLE user_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
    visit_type TEXT NOT NULL CHECK (visit_type IN ('restaurant_view', 'search_query', 'page_view')),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  CREATE INDEX idx_user_visits_user_id ON user_visits(user_id);
  CREATE INDEX idx_user_visits_created_at ON user_visits(created_at);
  ```
- [ ] Add `restaurant_views` table
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
  CREATE INDEX idx_restaurant_views_restaurant_id ON restaurant_views(restaurant_id);
  ```
- [ ] Add `search_queries` table
  ```sql
  CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    result_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  CREATE INDEX idx_search_queries_created_at ON search_queries(created_at);
  ```
- [ ] Run migration in Supabase
- [ ] Verify tables created

---

### 3.2 Progress Tracking Server Actions

- [ ] Create `actions/progress.ts` with tracking functions
- [ ] Implement `trackRestaurantView(restaurantId, userId)`
  - [ ] Insert/update restaurant_views record
  - [ ] Increment view_count if exists
  - [ ] Create new record if not exists
- [ ] Implement `trackSearchQuery(query, resultCount, userId)`
  - [ ] Insert search_queries record
  - [ ] Store query text and result count
- [ ] Implement `trackPageView(userId, path, metadata)`
  - [ ] Insert user_visits record
  - [ ] Store page path in metadata
- [ ] Implement `getUserProgress(userId)`
  - [ ] Get user's total restaurant views
  - [ ] Get user's search history
  - [ ] Get user's page view count
  - [ ] Return aggregated stats
- [ ] Add error handling for all functions
- [ ] Add TypeScript types for progress data

---

### 3.3 Progress Tracking Integration

- [ ] Add tracking to restaurant detail page
  - [ ] Track when user views restaurant
  - [ ] Call `trackRestaurantView()` on page load
- [ ] Add tracking to search component
  - [ ] Track when user performs search
  - [ ] Call `trackSearchQuery()` on search submit
  - [ ] Include result count
- [ ] Add tracking to map interactions
  - [ ] Track when user clicks marker
  - [ ] Track when user opens info card
- [ ] Handle anonymous users
  - [ ] Track without user_id (set to NULL)
  - [ ] Still collect aggregate data

---

### 3.4 Progress Display Components

- [ ] Create `components/progress/user-progress.tsx`
- [ ] Display user's progress metrics
  - [ ] Total restaurants viewed
  - [ ] Recent searches
  - [ ] Exploration progress (% of restaurants viewed)
- [ ] Create progress badges/milestones
  - [ ] "Explorer" - viewed 5 restaurants
  - [ ] "Food Scout" - viewed 10 restaurants
  - [ ] "Veggie Expert" - viewed 25 restaurants
- [ ] Add progress indicator to user profile (if exists)
- [ ] Style with Tailwind CSS
- [ ] Make responsive

---

### 3.5 Testing Progress Tracking

- [ ] Test restaurant view tracking
  - [ ] View a restaurant → check database
  - [ ] View same restaurant again → view_count increments
- [ ] Test search query tracking
  - [ ] Perform search → check database
  - [ ] Verify query text and result count saved
- [ ] Test progress display
  - [ ] View progress component → shows correct stats
  - [ ] Verify badges appear at milestones
- [ ] Test with anonymous users
  - [ ] Track views without login
  - [ ] Verify NULL user_id in database
- [ ] Test performance
  - [ ] Tracking doesn't slow down page loads
  - [ ] Database queries optimized with indexes

---

### Phase 3 Completion Checklist

- [ ] ✅ Progress tracking database schema created
- [ ] ✅ Tracking server actions implemented
- [ ] ✅ Tracking integrated into key user actions
- [ ] ✅ Progress display components created
- [ ] ✅ All tracking features tested
- [ ] ✅ Anonymous tracking works
- [ ] ✅ No performance impact

---

## Phase 4: Statistics Dashboard

**Status**: 📋 **NOT STARTED** - Ready to implement  
**Estimated Time**: 6-8 hours  
**Prerequisites**: Phase 1 complete, Phase 3 recommended  
**Deliverables**: Admin dashboard with charts and key metrics

### 4.1 Dashboard Page Structure

- [ ] Create `app/admin/dashboard/page.tsx`
- [ ] Set up dashboard layout
  - [ ] Header with title "Admin Dashboard"
  - [ ] Grid layout for metric cards
  - [ ] Section for charts
  - [ ] Section for recent activity
- [ ] Add navigation link to admin menu
- [ ] Make responsive (desktop + tablet optimized)

---

### 4.2 Dashboard Server Actions

- [ ] Create `actions/dashboard.ts` with stat functions
- [ ] Implement `getRestaurantStats()`
  - [ ] Total restaurants count
  - [ ] Count by category (vegetarian/vegan/vegetarian-friendly)
  - [ ] Count with photos
  - [ ] Count verified vs unverified
- [ ] Implement `getUserEngagementStats()`
  - [ ] Total users count
  - [ ] Active users (last 30 days)
  - [ ] New users (last 7 days)
- [ ] Implement `getReviewStats()` (if applicable)
  - [ ] Total reviews count
  - [ ] Average rating
  - [ ] Reviews per restaurant
- [ ] Implement `getSearchAnalytics()`
  - [ ] Top search queries (last 30 days)
  - [ ] Average searches per user
  - [ ] Search success rate (queries with results)
- [ ] Implement `getViewAnalytics()`
  - [ ] Total restaurant views
  - [ ] Most viewed restaurants
  - [ ] Average views per restaurant
- [ ] Add caching to expensive queries
- [ ] Add TypeScript types for all stats

---

### 4.3 Metric Cards Components

- [ ] Create `components/admin/metric-card.tsx`
- [ ] Display key metrics in cards:
  - [ ] Total Restaurants
  - [ ] Total Users
  - [ ] Active Users (last 30 days)
  - [ ] Total Restaurant Views
  - [ ] Total Searches
  - [ ] Restaurants with Photos (percentage)
- [ ] Add icons to each metric (lucide-react)
- [ ] Add trend indicators (up/down arrows) if applicable
- [ ] Style with shadcn/ui Card component
- [ ] Add skeleton loading states

---

### 4.4 Chart Components

**Option 1**: Use shadcn/ui with Recharts (recommended)

- [ ] Install chart dependencies
  ```bash
  pnpm add recharts
  pnpx shadcn@latest add chart
  ```

**Option 2**: Use alternative charting library

- [ ] Research and choose library (Chart.js, Victory, etc.)
- [ ] Install dependencies

**Charts to Create**:

- [ ] Create `components/admin/restaurant-category-chart.tsx`
  - [ ] Pie or bar chart showing restaurants by category
  - [ ] Legend with counts
- [ ] Create `components/admin/user-growth-chart.tsx`
  - [ ] Line chart showing user signups over time
  - [ ] Last 30 days
- [ ] Create `components/admin/top-restaurants-chart.tsx`
  - [ ] Bar chart showing most viewed restaurants
  - [ ] Top 10
- [ ] Create `components/admin/search-trends-chart.tsx`
  - [ ] Bar chart showing top search queries
  - [ ] Last 30 days
- [ ] Make all charts responsive
- [ ] Add tooltips for better UX
- [ ] Add loading states

---

### 4.5 Recent Activity Feed

- [ ] Create `components/admin/recent-activity.tsx`
- [ ] Display recent actions:
  - [ ] New restaurant additions
  - [ ] Edit suggestions (pending)
  - [ ] New user signups
  - [ ] Recent reviews (if applicable)
- [ ] Limit to last 10 items
- [ ] Show timestamp for each item
- [ ] Add "View All" link to detailed pages

---

### 4.6 Dashboard Filters & Date Range

- [ ] Add date range selector
  - [ ] Last 7 days
  - [ ] Last 30 days
  - [ ] Last 90 days
  - [ ] Custom range
- [ ] Update all stats based on selected range
- [ ] Persist filter selection in URL params
- [ ] Add "Refresh" button to reload stats

---

### 4.7 Testing Dashboard

- [ ] Test with no data
  - [ ] Shows "No data" messages
  - [ ] Charts display empty states
- [ ] Test with real data
  - [ ] All metrics display correctly
  - [ ] Charts render without errors
  - [ ] Percentages calculated correctly
- [ ] Test performance
  - [ ] Dashboard loads in <2 seconds
  - [ ] No lag when switching date ranges
- [ ] Test responsiveness
  - [ ] Desktop view (optimal)
  - [ ] Tablet view (usable)
  - [ ] Mobile view (basic support)
- [ ] Test admin access
  - [ ] Only admins can access
  - [ ] Non-admins redirected

---

### Phase 4 Completion Checklist

- [ ] ✅ Dashboard page created and accessible
- [ ] ✅ All key metrics displayed in cards
- [ ] ✅ Charts implemented and rendering correctly
- [ ] ✅ Recent activity feed working
- [ ] ✅ Date range filters functional
- [ ] ✅ Dashboard tested with real data
- [ ] ✅ Performance optimized
- [ ] ✅ Admin access control enforced

---

## Phase 5: Dark Mode

**Status**: 📋 **NOT STARTED** - Ready to implement  
**Estimated Time**: 3-4 hours  
**Prerequisites**: None (independent feature)  
**Deliverables**: Full dark mode support with toggle

### 5.1 Theme Provider Setup

- [x] `next-themes` already installed (per rules.md)
- [ ] Set up ThemeProvider in root layout
- [ ] Update `app/layout.tsx`:

  ```tsx
  import { ThemeProvider } from "next-themes";

  export default function RootLayout({ children }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }
  ```

- [ ] Test theme provider loads without errors

---

### 5.2 Theme Toggle Component

- [ ] Create `components/theme-toggle.tsx`
- [ ] Add toggle button with icon
  - [ ] Sun icon for light mode
  - [ ] Moon icon for dark mode
  - [ ] System icon for auto mode (optional)
- [ ] Implement toggle functionality
  ```tsx
  const { theme, setTheme } = useTheme();
  ```
- [ ] Add to navigation bar
- [ ] Style with shadcn/ui Button component
- [ ] Add dropdown for theme options (optional)
  - [ ] Light
  - [ ] Dark
  - [ ] System
- [ ] Add keyboard accessibility (Enter/Space)
- [ ] Test toggle works correctly

---

### 5.3 Dark Mode Styles - Core Components

Update Tailwind classes to support dark mode with `dark:` prefix.

**Navigation & Layout**:

- [ ] Update `components/Navbar.tsx`
  - [ ] Dark background: `dark:bg-gray-900`
  - [ ] Dark text: `dark:text-gray-100`
  - [ ] Dark borders: `dark:border-gray-700`
- [ ] Update main layout
  - [ ] Dark background for body
  - [ ] Dark text colors

**Map Components**:

- [ ] Update `components/map/naver-map.tsx`
  - [ ] Dark map controls
  - [ ] Dark background for control buttons
  - [ ] Adjust map style for dark mode (if API supports)
- [ ] Update `components/map/restaurant-info-card.tsx`
  - [ ] Dark card background: `dark:bg-gray-800`
  - [ ] Dark text: `dark:text-gray-100`
  - [ ] Dark borders: `dark:border-gray-700`
  - [ ] Dark hover states

---

### 5.4 Dark Mode Styles - Restaurant Components

- [ ] Update `components/restaurants/restaurant-filters.tsx`
  - [ ] Dark button backgrounds
  - [ ] Dark active state
  - [ ] Dark hover effects
- [ ] Update `components/restaurants/restaurant-search.tsx`
  - [ ] Dark input background: `dark:bg-gray-800`
  - [ ] Dark input text: `dark:text-gray-100`
  - [ ] Dark placeholder: `dark:placeholder-gray-500`
  - [ ] Dark border: `dark:border-gray-600`
- [ ] Update `components/restaurants/restaurant-detail-view.tsx`
  - [ ] Dark card sections
  - [ ] Dark text hierarchy
  - [ ] Dark image overlays
- [ ] Update `components/restaurants/ordering-guide.tsx`
  - [ ] Dark phrase cards
  - [ ] Dark copy button
  - [ ] Dark hover states
- [ ] Update `components/restaurants/side-dish-notes.tsx`
  - [ ] Dark note cards
  - [ ] Dark badge backgrounds
- [ ] Update `components/restaurants/naver-reviews.tsx`
  - [ ] Dark review cards
  - [ ] Dark keyword highlights

---

### 5.5 Dark Mode Styles - Admin Components

- [ ] Update admin navigation
  - [ ] Dark sidebar (if exists)
  - [ ] Dark admin menu
- [ ] Update `app/admin/restaurants/page.tsx`
  - [ ] Dark table background
  - [ ] Dark table rows
  - [ ] Dark table headers
  - [ ] Dark row hover states
- [ ] Update restaurant forms
  - [ ] Dark form backgrounds
  - [ ] Dark input fields
  - [ ] Dark labels
  - [ ] Dark buttons
- [ ] Update `app/admin/suggestions/page.tsx`
  - [ ] Dark suggestion cards
  - [ ] Dark action buttons
- [ ] Update dashboard (Phase 4)
  - [ ] Dark metric cards
  - [ ] Dark charts (adjust colors)
  - [ ] Dark activity feed

---

### 5.6 Dark Mode Styles - UI Components (shadcn/ui)

Most shadcn/ui components include dark mode support by default. Verify:

- [ ] Button component dark mode
- [ ] Card component dark mode
- [ ] Input component dark mode
- [ ] Textarea component dark mode
- [ ] Dialog component dark mode
- [ ] Form components dark mode
- [ ] Accordion component dark mode

If any need adjustment:

- [ ] Update component styles in `components/ui/`
- [ ] Add `dark:` variants to Tailwind classes

---

### 5.7 Dark Mode Color Scheme

Define consistent dark mode colors:

```css
/* In globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... other light mode colors ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark mode colors ... */
  }
}
```

- [ ] Update `app/globals.css` with dark mode CSS variables
- [ ] Ensure contrast ratios meet accessibility standards (WCAG AA)
- [ ] Test color combinations for readability

---

### 5.8 System Preference Detection

- [ ] Test system preference detection
  - [ ] Set OS to dark mode → app uses dark mode
  - [ ] Set OS to light mode → app uses light mode
  - [ ] User manual selection overrides system preference
- [ ] Persist user preference in localStorage
  - [ ] Refresh page → theme persists
  - [ ] Close browser → reopen → theme persists
- [ ] Handle theme changes without page reload

---

### 5.9 Dark Mode Testing

- [ ] Test on all pages
  - [ ] Homepage (map view)
  - [ ] Restaurant detail pages
  - [ ] Admin panel pages
  - [ ] Dashboard (if Phase 4 complete)
- [ ] Test theme toggle
  - [ ] Click toggle → switches immediately
  - [ ] No flash of unstyled content (FOUC)
  - [ ] No layout shifts
- [ ] Test with different starting themes
  - [ ] Start in light → switch to dark
  - [ ] Start in dark → switch to light
  - [ ] Start with system preference
- [ ] Test images and logos
  - [ ] Ensure logos visible in both modes
  - [ ] Add dark variants if needed
- [ ] Test accessibility
  - [ ] High contrast in dark mode
  - [ ] Text readable on all backgrounds
  - [ ] Focus indicators visible
- [ ] Test on different devices
  - [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
  - [ ] Mobile browsers (iOS Safari, Android Chrome)
  - [ ] Tablet browsers

---

### 5.10 Dark Mode Polish

- [ ] Add smooth transitions (optional)
  ```css
  * {
    @apply transition-colors duration-200;
  }
  ```
- [ ] Add loading state for theme toggle
  - [ ] Prevent layout shift during hydration
  - [ ] Use `suppressHydrationWarning` on html tag
- [ ] Add dark mode screenshots to README
- [ ] Document dark mode feature in PRD

---

### Phase 5 Completion Checklist

- [ ] ✅ ThemeProvider configured in root layout
- [ ] ✅ Theme toggle component created and functional
- [ ] ✅ All components support dark mode
- [ ] ✅ Color scheme consistent and accessible
- [ ] ✅ System preference detection works
- [ ] ✅ Theme persistence works (localStorage)
- [ ] ✅ No flash of unstyled content (FOUC)
- [ ] ✅ Tested on all pages and devices
- [ ] ✅ Meets accessibility standards (contrast)

---

## Phase 6: Data Seeding & Production Prep

**Status**: 📋 **NOT STARTED**  
**Estimated Time**: 10-20 hours (depending on data collection)  
**Prerequisites**: Phase 2 complete (testing)  
**Deliverables**: 50+ restaurants with complete data

### 6.1 Restaurant Data Collection

**Goal**: Collect data for 50+ restaurants in Seoul

**Categories to Research**:

- [ ] Vegetarian restaurants (target: 20+)
- [ ] Vegan restaurants (target: 15+)
- [ ] Vegetarian-friendly restaurants (target: 15+)

**Data to Collect for Each Restaurant**:

- [ ] Name (English + Korean)
- [ ] Category (vegetarian/vegan/vegetarian-friendly)
- [ ] Address (English + Korean)
- [ ] Coordinates (latitude, longitude)
  - Use Google Maps or Naver Maps to get coordinates
  - Right-click location → Copy coordinates
- [ ] Description (optional)
- [ ] Menu items (at least 3-5 items)
- [ ] Operating hours
- [ ] Price range (budget/mid-range/upscale)
- [ ] Naver Place ID (for reviews) - optional
- [ ] Ordering tips (for vegetarian-friendly)
- [ ] Photos (at least 1 per restaurant)

**Research Sources**:

- [ ] HappyCow.net (vegetarian restaurant directory)
- [ ] Naver Maps search (채식 레스토랑, 비건 식당)
- [ ] Google Maps reviews
- [ ] Korean vegetarian blogs/forums
- [ ] Social media (Instagram, Facebook groups)
- [ ] Personal visits (if possible)

**Data Collection Spreadsheet**:

- [ ] Create Google Sheet or Excel spreadsheet
- [ ] Columns: Name (EN), Name (KO), Category, Address (EN), Address (KO), Lat, Lng, Description, Menu, Hours, Price, Naver ID, Tips, Photo URLs
- [ ] Organize by category for easy entry

---

### 6.2 Data Entry via Admin Panel

- [ ] Sign in to admin account
- [ ] For each restaurant in spreadsheet:
  - [ ] Go to `/admin/restaurants/new`
  - [ ] Fill out form with collected data
  - [ ] Add coordinates (latitude, longitude)
  - [ ] Select category
  - [ ] Add ordering tips (for vegetarian-friendly)
  - [ ] Save restaurant
- [ ] Upload photos for each restaurant
  - [ ] Edit restaurant
  - [ ] Use photo upload component
  - [ ] Upload at least 1 photo per restaurant
  - [ ] Set primary photo
- [ ] Add side dish notes (for vegetarian-friendly)
  - [ ] Note which banchan are vegetarian
  - [ ] Add ordering phrases
  - [ ] Include descriptions

**Pro Tip**: Use keyboard shortcuts to speed up data entry

- [ ] Create template restaurant for copy-paste
- [ ] Use browser autofill for repeated fields

---

### 6.3 Data Quality Verification

- [ ] Verify each restaurant entry
  - [ ] Coordinates correct (shows on map in right location)
  - [ ] Name spelled correctly (EN + KO)
  - [ ] Address complete and accurate
  - [ ] Category assigned correctly
  - [ ] Photos display correctly
  - [ ] All required fields filled
- [ ] Test with real users (friends/family)
  - [ ] Can they find restaurants easily?
  - [ ] Is information clear and helpful?
  - [ ] Any missing information?
- [ ] Fix any data issues
- [ ] Mark verified restaurants
  - [ ] Update `is_verified` field
  - [ ] Only show verified restaurants to public (optional)

---

### 6.4 Test with Real Data

- [ ] Test map with 50+ markers
  - [ ] Map loads quickly (< 3 seconds)
  - [ ] All markers display correctly
  - [ ] Different icons for each category
  - [ ] No performance issues
- [ ] Test filtering with real data
  - [ ] Filter by category → correct restaurants show
  - [ ] Search by name → finds matches
  - [ ] Search by area → finds nearby restaurants
- [ ] Test restaurant detail pages
  - [ ] All data displays correctly
  - [ ] Photos load and display
  - [ ] Ordering guide shows for vegetarian-friendly
  - [ ] Side dish notes display (if added)
- [ ] Test on mobile device
  - [ ] Visit site on phone
  - [ ] Browse restaurants
  - [ ] View details
  - [ ] Use ordering guide
  - [ ] Verify user experience is smooth

---

### 6.5 Performance Optimization

- [ ] Optimize images
  - [ ] Resize images to appropriate sizes
  - [ ] Compress images (use TinyPNG or similar)
  - [ ] Convert to WebP format
  - [ ] Re-upload optimized images
- [ ] Test performance metrics
  - [ ] Run Lighthouse audit
  - [ ] Check Core Web Vitals
  - [ ] Optimize any issues found
- [ ] Consider marker clustering (if many restaurants)
  - [ ] Install marker clustering library
  - [ ] Implement clustering for map
  - [ ] Test with 50+ markers
- [ ] Add loading states
  - [ ] Skeleton loaders for restaurant cards
  - [ ] Loading spinner for map
  - [ ] Progress indicator for photo uploads

---

### 6.6 SEO & Metadata

- [ ] Add meta tags to pages
  - [ ] Homepage: title, description, keywords
  - [ ] Restaurant pages: dynamic title, description
  - [ ] Admin pages: noindex
- [ ] Create `app/sitemap.ts`
  ```typescript
  export default function sitemap() {
    // Generate sitemap with all restaurants
  }
  ```
- [ ] Create `app/robots.ts`
  ```typescript
  export default function robots() {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
      sitemap: "https://yoursite.com/sitemap.xml",
    };
  }
  ```
- [ ] Add Open Graph images
  - [ ] Create OG image for homepage
  - [ ] Add dynamic OG images for restaurant pages (optional)
- [ ] Test SEO
  - [ ] Preview on Google
  - [ ] Check meta tags in browser DevTools
  - [ ] Verify sitemap accessible

---

### Phase 6 Completion Checklist

- [ ] ✅ 50+ restaurants collected and added to database
- [ ] ✅ All restaurants have complete information
- [ ] ✅ At least 1 photo per restaurant
- [ ] ✅ Data quality verified
- [ ] ✅ Performance optimized (Lighthouse score >80)
- [ ] ✅ SEO metadata added
- [ ] ✅ Tested with real data on all devices
- [ ] ✅ User testing completed with positive feedback

---

## Phase 7: Deployment & Launch

**Status**: 📋 **NOT STARTED**  
**Estimated Time**: 3-4 hours  
**Prerequisites**: All previous phases complete  
**Deliverables**: Live production site on Vercel

### 7.1 Pre-Deployment Checklist

- [ ] All previous phases complete
- [ ] All tests passing
- [ ] No critical bugs
- [ ] 50+ restaurants in database
- [ ] All features working in local dev
- [ ] Environment variables documented

---

### 7.2 Vercel Deployment Setup

- [ ] Create Vercel account (if not exists)
- [ ] Install Vercel CLI (optional)
  ```bash
  pnpm add -g vercel
  ```
- [ ] Connect GitHub repository to Vercel
  1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Click "Add New Project"
  3. Import Git Repository
  4. Select your GitHub repo
  5. Configure project settings
- [ ] Configure build settings
  - [ ] Framework Preset: Next.js
  - [ ] Build Command: `pnpm build`
  - [ ] Output Directory: `.next`
  - [ ] Install Command: `pnpm install`

---

### 7.3 Production Environment Variables

- [ ] Add all environment variables in Vercel
  1. Go to Project Settings → Environment Variables
  2. Add each variable from `.env.local`:
     - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - [ ] `CLERK_SECRET_KEY`
     - [ ] `NEXT_PUBLIC_SUPABASE_URL`
     - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - [ ] `SUPABASE_SERVICE_ROLE_KEY`
     - [ ] `NEXT_PUBLIC_STORAGE_BUCKET`
     - [ ] `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID`
     - [ ] `NEXT_PUBLIC_NAVER_MAPS_CLIENT_SECRET` (if required)
     - [ ] `NAVER_LOCAL_API_KEY`
     - [ ] `NAVER_LOCAL_API_SECRET` (if required)
- [ ] Set environment: Production
- [ ] Verify all variables added correctly

---

### 7.4 Production Database Setup

- [ ] Create production Supabase project (if separate from dev)
  - [ ] Or use same project (acceptable for MVP)
- [ ] Run database migrations in production
  1. Go to Supabase Dashboard → SQL Editor
  2. Copy migration files
  3. Execute in order:
     - [ ] `20251107142116_create_restaurants_schema.sql`
     - [ ] `YYYYMMDDHHmmss_create_progress_tracking.sql` (if Phase 3 complete)
- [ ] Create production storage bucket
  - [ ] Bucket name: `restaurant-photos`
  - [ ] Configure RLS policies
- [ ] Copy restaurant data to production (if needed)
  - [ ] Export from dev database
  - [ ] Import to production database
  - [ ] Or re-enter via admin panel

---

### 7.5 Production API Keys

- [ ] Naver Maps API (production keys)
  - [ ] Create production application in Naver Cloud
  - [ ] Add production domain to whitelist
  - [ ] Get production API keys
  - [ ] Add to Vercel environment variables
- [ ] Naver Local API (production keys)
  - [ ] Update application settings
  - [ ] Add production domain to whitelist
  - [ ] Verify rate limits sufficient for production
- [ ] Clerk production setup
  - [ ] Update Clerk dashboard with production URLs
  - [ ] Configure redirect URLs
  - [ ] Test authentication in production

---

### 7.6 Deploy to Vercel

- [ ] Commit all changes to GitHub
  ```bash
  git add .
  git commit -m "chore: prepare for production deployment"
  git push origin main
  ```
- [ ] Trigger deployment
  - [ ] Vercel auto-deploys on push to main
  - [ ] Or manually deploy via Vercel dashboard
  - [ ] Or use CLI: `vercel --prod`
- [ ] Monitor deployment
  - [ ] Check build logs for errors
  - [ ] Wait for deployment to complete
  - [ ] Note production URL

---

### 7.7 Post-Deployment Testing

- [ ] Test production site
  - [ ] Visit production URL
  - [ ] Test homepage loads
  - [ ] Test map displays with API keys
  - [ ] Test authentication (sign up, sign in)
  - [ ] Test restaurant browsing
  - [ ] Test search and filters
  - [ ] Test restaurant detail pages
  - [ ] Test ordering guide copy functionality
  - [ ] Test photo uploads (admin)
  - [ ] Test admin panel access
  - [ ] Test dark mode toggle (if Phase 5 complete)
- [ ] Test on multiple devices
  - [ ] Desktop (Chrome, Firefox, Safari)
  - [ ] Mobile (iOS, Android)
  - [ ] Tablet
- [ ] Test performance
  - [ ] Run Lighthouse audit on production
  - [ ] Check Core Web Vitals
  - [ ] Verify < 3 second load time
- [ ] Fix any production-only issues

---

### 7.8 Custom Domain (Optional)

- [ ] Purchase domain (if desired)
  - [ ] Recommended: .com or .app
  - [ ] Example: namoolnow.com
- [ ] Add domain to Vercel
  1. Go to Project Settings → Domains
  2. Add custom domain
  3. Configure DNS records (as instructed by Vercel)
  4. Wait for DNS propagation
- [ ] Update environment variables with new domain
  - [ ] Update Clerk redirect URLs
  - [ ] Update Naver API whitelists
- [ ] Test custom domain
  - [ ] Visit custom domain
  - [ ] Verify SSL certificate active (https)
  - [ ] Test all features work

---

### 7.9 Monitoring & Analytics

- [ ] Set up Vercel Analytics
  - [ ] Enable in Vercel dashboard
  - [ ] Monitor page views, performance
- [ ] Set up error monitoring (optional)
  - [ ] Sentry integration
  - [ ] Or Vercel logs
- [ ] Set up Google Analytics (optional)
  - [ ] Create GA4 property
  - [ ] Add tracking code to site
- [ ] Monitor Naver API usage
  - [ ] Check daily usage
  - [ ] Ensure within rate limits
  - [ ] Set up alerts if approaching limits

---

### 7.10 Launch Checklist

Before announcing launch:

- [ ] ✅ Production site live and accessible
- [ ] ✅ All features working in production
- [ ] ✅ 50+ restaurants with complete data
- [ ] ✅ Performance meets targets (< 3s load)
- [ ] ✅ Mobile responsive and tested
- [ ] ✅ Bilingual interface working
- [ ] ✅ Authentication working
- [ ] ✅ Map displaying correctly
- [ ] ✅ Naver reviews integration working (if API keys obtained)
- [ ] ✅ Ordering guide functional
- [ ] ✅ Admin panel accessible and functional
- [ ] ✅ Error handling in place
- [ ] ✅ SEO metadata configured
- [ ] ✅ No critical bugs
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ Analytics set up

---

### 7.11 Launch Announcement

- [ ] Create announcement plan
  - [ ] Target audience: vegetarian/vegan travelers to Korea
  - [ ] Channels: Reddit, Facebook groups, Twitter, Instagram
- [ ] Prepare launch materials
  - [ ] Screenshots of app
  - [ ] Short video demo (optional)
  - [ ] Press release / blog post
  - [ ] Social media posts
- [ ] Announce on relevant platforms
  - [ ] Reddit: r/vegan, r/vegetarian, r/korea
  - [ ] Facebook: Vegetarian/Vegan Korea groups
  - [ ] Instagram: Plant-based travel accounts
  - [ ] Twitter: #vegantravel #koreatravel
  - [ ] HappyCow community (if allowed)
- [ ] Monitor feedback
  - [ ] Respond to comments and questions
  - [ ] Collect user feedback
  - [ ] Note feature requests
  - [ ] Fix reported bugs quickly

---

### Phase 7 Completion Checklist

- [ ] ✅ Site deployed to Vercel production
- [ ] ✅ All environment variables configured
- [ ] ✅ Production database set up with data
- [ ] ✅ Production API keys configured
- [ ] ✅ Post-deployment testing complete
- [ ] ✅ Custom domain configured (optional)
- [ ] ✅ Monitoring and analytics set up
- [ ] ✅ Launch announced to target audience
- [ ] ✅ Initial feedback collected

**🎉 CONGRATULATIONS! NamoolNow is now live!**

---

## Future Enhancements

Features to consider post-launch (not prioritized):

### User Features

- [ ] User reviews and ratings system
- [ ] Favorites/bookmarks functionality
- [ ] User profiles with saved restaurants
- [ ] Restaurant recommendations based on preferences
- [ ] Offline mode (PWA)
- [ ] Push notifications for new restaurants
- [ ] User-submitted photos

### Admin Features

- [ ] Bulk restaurant import (CSV)
- [ ] Restaurant verification workflow
- [ ] Advanced analytics dashboard
- [ ] User management panel
- [ ] Content moderation tools

### Technical Enhancements

- [ ] Geocoding API integration (automatic coordinates)
- [ ] Directions integration (Naver Maps directions)
- [ ] List view alternative to map
- [ ] Advanced filters (price, rating, distance)
- [ ] Map marker clustering
- [ ] Real-time collaboration for admins
- [ ] API for third-party integrations

### Expansion

- [ ] Expand to more cities (Busan, Jeju, Incheon)
- [ ] Add more language support (Japanese, Chinese)
- [ ] Restaurant owner accounts
- [ ] Mobile app (React Native)
- [ ] Integration with delivery services

---

## Code Quality Improvements

Ongoing code quality tasks (can be done anytime):

### Spacing & Layout

- [ ] Review all components for margin usage
  - [ ] Convert margins to gap/padding
  - [ ] Use gap for sibling spacing
  - [ ] Use padding for container spacing
- [ ] Ensure consistent spacing scale
  - [ ] gap-2, gap-4, gap-6, gap-8
  - [ ] p-2, p-4, p-6, p-8
  - [ ] Avoid arbitrary values

### Component Structure

- [ ] Review components for unnecessary abstractions
- [ ] Ensure single responsibility principle (SRP)
- [ ] Avoid unnecessary wrapper components
- [ ] Split large components (>500 lines)

### TypeScript

- [ ] Add JSDoc comments to complex functions
- [ ] Review for any `any` types (especially Naver Maps)
- [ ] Ensure all server actions properly typed
- [ ] Add more specific types where possible

### Testing

- [ ] Unit tests for server actions
- [ ] Integration tests for API calls
- [ ] E2E tests for user flows (Playwright)
- [ ] Component tests with React Testing Library

### Documentation

- [ ] Update README.md with setup instructions
- [ ] Document API usage
- [ ] Add inline code comments
- [ ] Create developer guide

### Performance

- [ ] Optimize bundle size
- [ ] Code splitting for routes
- [ ] Lazy load images
- [ ] Implement caching strategies

---

## Notes

### Development Guidelines

- **Test as you build**: Don't wait until the end to test features
- **Commit frequently**: Small, incremental commits with clear messages
- **Data quality matters**: Quality > quantity for restaurants
- **Mobile-first**: Always test on mobile devices
- **Accessibility**: Consider all users (keyboard nav, screen readers)
- **Performance**: Monitor load times and optimize early

### Phase Dependencies

Some phases depend on others:

- Phase 2 depends on Phase 1 (manual setup)
- Phase 6 depends on Phase 2 (testing)
- Phase 7 depends on all previous phases

Independent phases that can be done in parallel:

- Phase 3 (Progress Tracking)
- Phase 4 (Statistics Dashboard)
- Phase 5 (Dark Mode)

### Getting Help

If you encounter issues:

1. Check official documentation (Next.js, Supabase, Clerk, Naver APIs)
2. Search GitHub issues for similar problems
3. Ask in relevant Discord/Slack communities
4. Use context7 MCP to read official docs
5. Search Stack Overflow

### Success Tips

- **Start with Phase 1**: Complete manual setup before anything else
- **Be patient with APIs**: Naver API approval may take time
- **Collect good data**: Restaurant data quality affects user experience
- **Test thoroughly**: Better to find bugs before launch
- **Iterate based on feedback**: Users will tell you what's needed

---

**Last Updated**: 2025-01-11  
**Next Review**: After completing Phase 1

**Current Focus**: Phase 1 - Foundation Setup (Manual tasks)
