# Phase 1: Foundation Setup Guide

**Status**: In Progress  
**Started**: 2025-01-11  
**Estimated Time**: 1-2 hours

This guide walks you through all manual setup tasks required before testing and further development.

---

## 📋 Quick Checklist

- [ ] 1.1 Run database migration in Supabase
- [ ] 1.2 Create storage bucket `restaurant-photos`
- [ ] 1.3 Get Naver Maps API keys
- [ ] 1.4 Get Naver Local API keys
- [ ] 1.5 Configure environment variables

---

## Step 1.1: Database Migration ⚠️ **DO THIS FIRST**

### Why This Matters
All features depend on these database tables existing. This is the most critical step.

### Instructions

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query" button

3. **Copy Migration SQL**
   - Open the file: `supabase/migrations/20251107142116_create_restaurants_schema.sql`
   - Copy the entire contents (137 lines)

4. **Execute Migration**
   - Paste the SQL into the SQL Editor
   - Click the "Run" button (or press Ctrl/Cmd + Enter)
   - Wait for execution to complete

5. **Verify Success**
   - You should see "Success. No rows returned" (or similar)
   - No error messages should appear

6. **Verify Tables Created**
   - Click "Table Editor" in the left sidebar
   - You should see these new tables:
     - ✅ `restaurants`
     - ✅ `restaurant_photos`
     - ✅ `restaurant_side_dish_notes`
     - ✅ `restaurant_edit_suggestions`

### ✅ Completion Criteria
- [ ] Migration executed without errors
- [ ] All 4 tables visible in Table Editor
- [ ] Can click into each table and see column structure

---

## Step 1.2: Supabase Storage Bucket Setup

### Why This Matters
Without this bucket, photo uploads will fail in the admin panel.

### Instructions

1. **Open Supabase Storage**
   - Go to your Supabase Dashboard
   - Click "Storage" in the left sidebar

2. **Create New Bucket**
   - Click "New bucket" button
   - Bucket name: `restaurant-photos`
   - **Public bucket**: ✅ Yes (check this box)
   - Click "Create bucket"

3. **Configure RLS Policies** (Important for Security)
   - Click on the `restaurant-photos` bucket
   - Go to "Policies" tab
   - Click "New policy"
   
   **Policy 1: Public Read Access**
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'restaurant-photos');
   ```
   
   **Policy 2: Authenticated Upload**
   ```sql
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'restaurant-photos' 
     AND auth.role() = 'authenticated'
   );
   ```
   
   **Policy 3: Authenticated Update**
   ```sql
   CREATE POLICY "Users can update own uploads"
   ON storage.objects FOR UPDATE
   USING (
     bucket_id = 'restaurant-photos'
     AND auth.role() = 'authenticated'
   );
   ```
   
   **Policy 4: Authenticated Delete**
   ```sql
   CREATE POLICY "Users can delete own uploads"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'restaurant-photos'
     AND auth.role() = 'authenticated'
   );
   ```

4. **Test Bucket Access**
   - Try uploading a test image through the Supabase dashboard
   - Click on the uploaded image
   - Copy the public URL
   - Paste URL in browser → image should display

### ✅ Completion Criteria
- [ ] Bucket `restaurant-photos` created
- [ ] Bucket is set to "Public"
- [ ] All 4 RLS policies created
- [ ] Test upload works
- [ ] Public URL accessible

---

## Step 1.3: Naver Maps API Setup

### Why This Matters
The map component will not load without valid Naver Maps API keys.

### Instructions

1. **Create Naver Cloud Platform Account**
   - Go to [https://www.ncloud.com/](https://www.ncloud.com/)
   - Click "회원가입" (Sign Up) or "로그인" (Login)
   - Complete registration (may require Korean phone number)
   - Verify your email/phone

2. **Apply for Maps API**
   - Log in to Naver Cloud Platform Console
   - Go to: **Services** → **AI·NAVER API** → **Maps**
   - Click "이용 신청" (Apply for Service)
   - Fill out the application form:
     - Service name: NamoolNow (or your project name)
     - Service description: Vegetarian restaurant map for travelers
     - Usage: Web service
   - Submit application
   - Approval is usually instant

3. **Create Application & Get API Keys**
   - After approval, go to "애플리케이션 등록" (Application Registration)
   - Click "애플리케이션 등록" (Register Application) button
   - Fill in details:
     - Application name: NamoolNow
     - Service: **Web Dynamic Map** (check this)
     - Web service URL: `http://localhost:3000` (for development)
   - Click "등록" (Register)
   
4. **Copy Your API Keys**
   - You'll see your application in the list
   - Click on it to view details
   - Copy the following:
     - **Client ID** (인증 정보)
     - **Client Secret** (if shown)

5. **Save Keys for Later**
   - Keep these keys safe - you'll add them to `.env.local` in Step 1.5

### Important Notes
- For production deployment, you'll need to add your production domain to the whitelist
- Keep your Client Secret private - never commit it to git
- Free tier includes sufficient requests for development and moderate usage

### ✅ Completion Criteria
- [ ] Naver Cloud Platform account created
- [ ] Maps API approved
- [ ] Application created
- [ ] Client ID copied
- [ ] Client Secret copied (if applicable)

---

## Step 1.4: Naver Local API Setup

### Why This Matters
This enables the Naver reviews feature for vegetarian-friendly restaurants.

### Instructions

1. **Go to Naver Developers**
   - Visit [https://developers.naver.com/](https://developers.naver.com/)
   - Log in with your Naver account (same as Naver Cloud)

2. **Create Application**
   - Click "애플리케이션 등록" (Register Application)
   - Or go to "내 애플리케이션" (My Applications) → "애플리케이션 등록"
   
3. **Configure Application**
   - Application name: NamoolNow Local API
   - Select APIs to use:
     - ✅ **검색** (Search) - This includes Local search
   - Environment settings:
     - 웹 서비스 URL: `http://localhost:3000`
   - Click "등록하기" (Register)

4. **Get API Credentials**
   - After registration, you'll see:
     - **Client ID** (애플리케이션 클라이언트 아이디)
     - **Client Secret** (애플리케이션 클라이언트 시크릿)
   - Copy both values

5. **Check API Limits**
   - Free tier: 25,000 requests/day
   - Should be sufficient for development and moderate usage

### Important Notes
- This is different from Naver Cloud Platform Maps API
- The "Local" search API is part of Naver Open API platform
- For production, add your production domain to allowed URLs

### ✅ Completion Criteria
- [ ] Naver Developers account ready
- [ ] Application created with Search API enabled
- [ ] Client ID copied
- [ ] Client Secret copied

---

## Step 1.5: Environment Variables Configuration

### Why This Matters
Your app needs these environment variables to connect to all services.

### Instructions

1. **Create `.env.local` File**
   - In your project root directory, create a new file named `.env.local`
   - This file is git-ignored (won't be committed)

2. **Add All Environment Variables**
   
   Copy and paste this template, then fill in your actual values:

```bash
# Clerk Authentication
# Get these from: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Clerk URLs (usually these defaults are fine)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
# Get these from: https://supabase.com/dashboard → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXXXXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXXXXXXXXXXXXXXXXXXXX
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Supabase Storage Bucket
NEXT_PUBLIC_STORAGE_BUCKET=restaurant-photos

# Naver Maps API
# Get these from: https://www.ncloud.com/product/applicationService/maps
NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID=your_naver_maps_client_id_here
NEXT_PUBLIC_NAVER_MAPS_CLIENT_SECRET=your_naver_maps_client_secret_here

# Naver Local API (for reviews)
# Get these from: https://developers.naver.com/apps/#/list
NAVER_LOCAL_API_KEY=your_naver_local_api_key_here
NAVER_LOCAL_API_SECRET=your_naver_local_api_secret_here
```

3. **Fill in Your Values**
   
   **Clerk Keys** (if not already set):
   - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Select your application
   - Go to "API Keys"
   - Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
   
   **Supabase Keys** (if not already set):
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy:
     - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
     - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
   
   **Storage Bucket**:
   - Should be: `restaurant-photos` (the bucket you created)
   
   **Naver Maps**:
   - Use the Client ID and Secret from Step 1.3
   
   **Naver Local**:
   - Use the Client ID and Secret from Step 1.4

4. **Verify File Format**
   - No spaces around `=` signs
   - No quotes around values (unless they contain spaces)
   - One variable per line
   - Keys should be on separate lines from Step 1.3 and 1.4 (different services)

5. **Restart Dev Server**
   ```bash
   # Stop your dev server (Ctrl + C)
   # Then restart it
   pnpm dev
   ```
   
   Environment variables are only loaded when the server starts!

### ✅ Completion Criteria
- [ ] `.env.local` file created
- [ ] All Clerk variables filled in
- [ ] All Supabase variables filled in
- [ ] Storage bucket name set
- [ ] Naver Maps Client ID and Secret added
- [ ] Naver Local API keys added
- [ ] Dev server restarted
- [ ] No environment variable errors in console

---

## Step 1.6: Verification & Testing

### Verify Everything is Set Up Correctly

1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for any environment variable errors
   - Common issues:
     - "NEXT_PUBLIC_SUPABASE_URL is not defined"
     - "Cannot read property 'CLIENT_ID' of undefined"
   - If you see these, double-check your `.env.local` file

3. **Test Supabase Connection**
   - Open: `http://localhost:3000/storage-test`
   - Should load without Supabase connection errors
   - Check browser console for any Supabase errors

4. **Test Clerk Authentication**
   - Try to access: `http://localhost:3000/admin`
   - Should redirect to Clerk sign-in page
   - Try signing in
   - Should successfully authenticate

5. **Test Database Access**
   - Go to: `http://localhost:3000/admin/restaurants`
   - Should load empty restaurant list (no errors)
   - Try creating a test restaurant
   - If successful, database is working!

6. **Test Map Loading** (if Naver Maps keys configured)
   - Go to: `http://localhost:3000/`
   - Map should load (even if empty)
   - Check console for Naver Maps API errors
   - If you see "Invalid Client ID", double-check your keys

### Common Issues & Solutions

**Issue**: "Error: Failed to load Supabase client"
- **Solution**: Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Restart dev server after adding keys

**Issue**: "Naver Maps API authentication failed"
- **Solution**: Verify `NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID` is correct
- Check that `localhost:3000` is in your Naver Maps application's whitelist
- Client ID should be the one from Naver Cloud Platform (not Naver Developers)

**Issue**: "Cannot insert into table 'restaurants'"
- **Solution**: Make sure database migration ran successfully
- Go to Supabase → Table Editor → Check if `restaurants` table exists
- Re-run migration if needed

**Issue**: "Storage bucket 'restaurant-photos' not found"
- **Solution**: Verify bucket name in Supabase Storage matches `.env.local`
- Check that bucket is set to "Public"

### ✅ Phase 1 Complete When:
- [ ] ✅ Database migration executed successfully
- [ ] ✅ All tables visible in Supabase Table Editor
- [ ] ✅ Storage bucket created and accessible
- [ ] ✅ Naver Maps API keys obtained
- [ ] ✅ Naver Local API keys obtained
- [ ] ✅ All environment variables configured in `.env.local`
- [ ] ✅ Dev server starts without environment errors
- [ ] ✅ Clerk authentication works (can sign in)
- [ ] ✅ Admin panel loads without database errors
- [ ] ✅ Can create test restaurant (database write works)

---

## Next Steps

Once Phase 1 is complete, you're ready for **Phase 2: Testing Existing Features**!

Phase 2 will involve:
- Testing all built features with real data
- Verifying map display and interactions
- Testing CRUD operations
- Testing photo uploads
- Testing search and filtering
- Testing bilingual support
- Testing responsive design

See `docs/TODO.md` for detailed Phase 2 checklist.

---

## Need Help?

### Documentation Links
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Naver Cloud Maps API](https://www.ncloud.com/product/applicationService/maps)
- [Naver Developers API](https://developers.naver.com/docs/common/openapiguide/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

### Common Resources
- Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Clerk Dashboard: [https://dashboard.clerk.com](https://dashboard.clerk.com)
- Naver Cloud Console: [https://console.ncloud.com](https://console.ncloud.com)
- Naver Developers: [https://developers.naver.com/](https://developers.naver.com/)

---

**Last Updated**: 2025-01-11  
**Next Review**: After completing Phase 1 setup

