# Wedding Website Setup Guide

## Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Supabase account
- Resend account (optional, for custom emails)
- Vercel account (for deployment)

## Project Status

### ✅ What's Already Completed

#### Backend & Database
- ✅ **Supabase database** with guests table including all RSVP fields
- ✅ **Database schema** with proper relationships and constraints
- ✅ **TypeScript types** generated from the database schema
- ✅ **Initial test users** added to the database

#### Authentication
- ✅ **Supabase Auth** configured for passwordless magic link authentication
- ✅ **Server-side rendering** support with proper cookie handling
- ✅ **Middleware** for automatic token refresh
- ✅ **Admin/guest role** differentiation
- ✅ **Magic link confirmation** endpoint

#### Frontend Pages
- ✅ **Home page** with wedding details and magic link sign-in
- ✅ **Guest dashboard** with RSVP form and wedding details
- ✅ **Admin dashboard** with guest management and email sending
- ✅ **Responsive design** using Tailwind CSS

#### Email System
- ✅ **Email templates** for Save the Date and RSVP reminders
- ✅ **Resend integration** for email sending
- ✅ **Admin email controls** in the dashboard

### 🔧 What You Need to Complete

## Setup Instructions

### 1. Installation ✅

Clone the repository and install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables ✅

Create a `.env.local` file from the example:
```bash
cp .env.local.example .env.local
```

Then fill in the required values:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., https://skchzzvyjffvrezruwkf.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from your Supabase project settings
- `RESEND_API_KEY` - Optional: Get from Resend dashboard for custom emails

### 3. Database Setup ✅

If starting fresh:
1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Run the database schema:**
   - Go to the SQL editor in Supabase
   - Copy and paste the contents of `database.sql`
   - Run the query to create tables and policies

### 4. Configure Supabase Authentication ✅

1. **Configure Magic Link Email Template:**
   - Go to your Supabase project → Authentication → Email Templates
   - Edit the "Magic Link" template
   - Replace the template content with:
   ```html
   <h2>Magic Link</h2>
   <p>Follow this link to login:</p>
   <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Log In</a></p>
   ```

2. **Set Site URL and Redirect URLs:**
   - Go to Authentication → URL Configuration
   - Set Site URL to: `http://localhost:3000` (for development)
   - For production, set it to: `https://yishanandyitong.wedding`
   - Add redirect URLs:
     - `http://localhost:3000/**` (for development)
     - `https://yishanandyitong.wedding/**` (for production)

### 5. Email Setup with Resend (Optional) ✅

For custom email sending:
1. Go to [Resend](https://resend.com/) and create an account
2. Get your API key from the dashboard
3. Add to your `.env.local` file
4. Verify your domain `yishanandyitong.wedding` in Resend

### 6. Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit http://localhost:3000**

3. **Test user flows:**
   - Visit home page and enter email for magic link
   - Check email and click magic link to sign in
   - Test RSVP form as guest
   - Test admin dashboard with admin account
   - Test email sending functionality

## Test Users

The database includes these test users:
- **Admins:** 
  - zha.yitong@gmail.com
  - yishan.zhang007@gmail.com
- **Guests:** 
  - cfeng.charlie@gmail.com
  - yitong@voteagora.com

Admin users have `is_admin = true` in the database.

## Features

### For Guests:
- View wedding details (date, venue, address)
- RSVP with attendance status
- Add dietary preferences
- Add +1 information
- Update RSVP if needed

### For Admins:
- View all guest RSVPs
- See attendance statistics
- Send Save the Date emails
- Send RSVP reminder emails
- Export guest data (can be added easily)

## Deployment ✅

1. **Push your code to GitHub** ✅

2. **Deploy to Vercel:** ✅
   ```bash
   vercel --prod
   ```
   Or connect your GitHub repo to Vercel for automatic deployments

3. **Set up environment variables in Vercel:** ✅
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`

4. **Update Supabase settings for production:**
   - Update Site URL to your production domain
   - Add production redirect URLs

**Production URL:** https://yishanyitongwedding-na8lo4s4z-yitong-zhangs-projects.vercel.app

## Adding Guests

To add new guests:
1. Use the Supabase dashboard to add rows to the `guests` table
2. Set `is_admin = true` for admin users
3. Each guest needs at least an email address

## Troubleshooting

If you encounter issues, check:
1. All environment variables are set correctly
2. Supabase database schema is properly created
3. Supabase magic links are configured with correct Site URL
4. Resend domain is verified (if using custom emails)
5. Database has proper RLS policies enabled

## Next Steps

1. Complete the environment setup
2. Configure magic link email template in Supabase
3. Test all functionality
4. Add more guests to the database
5. Customize styling if needed
6. Deploy to production

The core functionality is complete - you just need to configure the Supabase settings and optionally set up Resend for custom emails!