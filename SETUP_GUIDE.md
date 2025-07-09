# Wedding Website Setup Guide

## What's Been Completed ✅

I've successfully set up the wedding website with the following features:

### Backend & Database
- ✅ **Supabase database** with guests table including all RSVP fields
- ✅ **Database schema** with proper relationships and constraints
- ✅ **TypeScript types** generated from the database schema
- ✅ **Initial test users** added to the database

### Authentication
- ✅ **Supabase Auth** configured for passwordless magic link authentication
- ✅ **Server-side rendering** support with proper cookie handling
- ✅ **Middleware** for automatic token refresh
- ✅ **Admin/guest role** differentiation
- ✅ **Magic link confirmation** endpoint

### Frontend Pages
- ✅ **Home page** with wedding details and magic link sign-in
- ✅ **Guest dashboard** with RSVP form and wedding details
- ✅ **Admin dashboard** with guest management and email sending
- ✅ **Responsive design** using Tailwind CSS

### Email System
- ✅ **Email templates** for Save the Date and RSVP reminders
- ✅ **Resend integration** for email sending
- ✅ **Admin email controls** in the dashboard

## What You Need to Complete 🔧

### 1. Environment Variables
Create a `.env.local` file (use `.env.local.example` as reference):

```bash
# Copy the example file
cp .env.local.example .env.local
```

Then fill in:
- `NEXT_PUBLIC_SUPABASE_URL` - Already set to: https://skchzzvyjffvrezruwkf.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Get from your Supabase project settings
- `RESEND_API_KEY` - Optional: Get from Resend dashboard for custom emails

### 2. Configure Magic Link Email Template
1. Go to your Supabase project → Authentication → Email Templates
2. Edit the "Magic Link" template
3. Replace the template content with:

```html
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Log In</a></p>
```

### 3. Set Site URL
1. Go to your Supabase project → Authentication → URL Configuration
2. Set Site URL to: `http://localhost:3000` (for development)
3. For production, set it to: `https://yishanandyitong.wedding`
4. Add redirect URLs:
   - `http://localhost:3000/**` (for development)
   - `https://yishanandyitong.wedding/**` (for production)

### 4. Resend API Setup (Optional)
1. Go to [Resend](https://resend.com/) and create account
2. Get your API key from the dashboard
3. Add to your `.env.local` file
4. Verify your domain `yishanandyitong.wedding` in Resend

### 5. Deploy to Vercel
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Testing the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Test user flows:**
   - Visit home page and enter email for magic link
   - Check email and click magic link to sign in
   - Test RSVP form as guest
   - Test admin dashboard with admin account
   - Test email sending functionality

## Current Test Users

The database has these test users:
- **Admins:** zha.yitong@gmail.com, yishan.zhang007@gmail.com
- **Guests:** cfeng.charlie@gmail.com, yitong@voteagora.com

## Key Features Available

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

## Next Steps

1. Complete the environment setup
2. Configure magic link email template in Supabase
3. Test all functionality
4. Add more guests to the database
5. Customize styling if needed
6. Deploy to production

The core functionality is complete - you just need to configure the Supabase settings and optionally set up Resend for custom emails!