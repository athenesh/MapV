\

# Phase 1: Quick Start Checklist

**🎯 Goal**: Complete all manual setup tasks to unblock testing and development

**⏱️ Time**: 1-2 hours

---

## ✅ Step-by-Step Checklist

### 1️⃣ Database Migration (5 minutes)

**What**: Create all database tables

**Steps**:
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → Your Project
2. Go to **SQL Editor** → New Query
3. Copy entire file: `supabase/migrations/20251107142116_create_restaurants_schema.sql`
4. Paste and click **Run**
5. Verify: Go to **Table Editor** → See 4 new tables

**✅ Done when**: All tables visible, no errors

---

### 2️⃣ Storage Bucket (10 minutes)

**What**: Create bucket for restaurant photos

**Steps**:
1. Supabase Dashboard → **Storage** → **New bucket**
2. Name: `restaurant-photos`
3. Public: ✅ **Yes**
4. Create 4 RLS policies (see full guide)
5. Test: Upload an image, verify public URL works

**✅ Done when**: Bucket created, public, policies set, test upload works

---

### 3️⃣ Naver Maps API (20-30 minutes)

**What**: Get API keys for map display

**Steps**:
1. Create account at [Naver Cloud Platform](https://www.ncloud.com/)
2. Go to: Services → AI·NAVER API → Maps
3. Click "이용 신청" (Apply)
4. Create application:
   - Service: **Web Dynamic Map**
   - URL: `http://localhost:3000`
5. Copy **Client ID** and **Client Secret**

**✅ Done when**: You have Client ID and Secret saved

---

### 4️⃣ Naver Local API (15-20 minutes)

**What**: Get API keys for restaurant reviews

**Steps**:
1. Go to [Naver Developers](https://developers.naver.com/)
2. Create application
3. Enable **검색** (Search) API
4. Add URL: `http://localhost:3000`
5. Copy **Client ID** and **Client Secret**

**✅ Done when**: You have different Client ID and Secret for Local API

---

### 5️⃣ Environment Variables (10 minutes)

**What**: Configure all API keys in your app

**Steps**:
1. Copy `docs/env.local.template` to project root as `.env.local`
2. Fill in all values:
   - ✅ Clerk keys (if not already set)
   - ✅ Supabase keys (if not already set)
   - ✅ Storage bucket: `restaurant-photos`
   - ✅ Naver Maps keys (from step 3)
   - ✅ Naver Local keys (from step 4)
3. **Restart dev server**: `pnpm dev`

**✅ Done when**: Server starts, no environment errors

---

### 6️⃣ Verification (10 minutes)

**What**: Test that everything works

**Quick Tests**:
```bash
# 1. Start server
pnpm dev

# 2. Open these URLs and check for errors:
# - http://localhost:3000/ (homepage, map should try to load)
# - http://localhost:3000/admin (should redirect to Clerk login)
# - http://localhost:3000/admin/restaurants (should show empty list)

# 3. Try creating a test restaurant in admin panel
# 4. Check browser console for errors
```

**✅ Done when**: 
- No environment variable errors
- Can sign in with Clerk
- Can create test restaurant
- Map attempts to load (even if showing API errors initially)

---

## 🚨 Common Issues

### "Supabase connection error"
→ Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
→ Restart dev server

### "Naver Maps authentication failed"
→ Verify `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID`  
→ Check `localhost:3000` is in Naver Maps app whitelist

### "Cannot insert into restaurants table"
→ Re-run database migration  
→ Check table exists in Supabase Table Editor

### "Storage bucket not found"
→ Verify bucket name matches in Supabase and `.env.local`  
→ Check bucket is set to Public

---

## 📚 Full Documentation

For detailed instructions with screenshots and troubleshooting:
- See: `docs/PHASE1-SETUP-GUIDE.md`

For phase overview and what comes next:
- See: `docs/TODO.md` → Phase 1 section

---

## ✅ Phase 1 Complete!

Once all checkboxes above are checked, you're ready for:

**Phase 2: Testing Existing Features**
- Test all built features with real data
- Verify CRUD operations
- Test map interactions
- Test photo uploads
- Test search and filtering

See `docs/TODO.md` Phase 2 for detailed testing checklist.

---

**Last Updated**: 2025-01-11

