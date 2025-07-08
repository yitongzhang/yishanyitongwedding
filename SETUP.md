# Wedding Website Setup Instructions

## Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Supabase account
- Resend account
- Vercel account (for deployment)

## Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables:**
   Copy `.env.local` and fill in the required values:
   ```bash
   cp .env.local .env.local.example
   ```

## Database Setup

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Run the database schema:**
   - Go to the SQL editor in Supabase
   - Copy and paste the contents of `database.sql`
   - Run the query to create tables and policies

3. **Update environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Email Setup (Resend)

1. **Create a Resend account:**
   - Go to [resend.com](https://resend.com)
   - Create an account and verify your domain
   - Get your API key

2. **Update environment variables:**
   ```
   RESEND_API_KEY=your_resend_api_key
   ```

## Authentication Setup

1. **Configure Supabase Magic Links:**
   - Go to your Supabase project → Authentication → Email Templates
   - Edit the "Magic Link" template
   - Set Site URL to: `http://localhost:3000` (for development)
   - Add redirect URLs: `http://localhost:3000/**`

2. **Environment variables are already configured:**
   ```
   NEXTAUTH_SECRET=already_generated
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit http://localhost:3000**

## Deployment

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Set up environment variables in Vercel:**
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`

3. **Update domain in environment:**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

## Adding Guests

To add new guests, you can either:
1. Use the Supabase dashboard to add rows to the `guests` table
2. Create an admin function (not included in this basic setup)

## Features

- ✅ Public homepage with wedding info
- ✅ Magic link authentication
- ✅ Guest dashboard with RSVP form
- ✅ Admin dashboard to view all RSVPs
- ✅ Email sending (Save the Date & Reminders)
- ✅ Responsive design
- ✅ Database with proper permissions

## Admin Users

Admin users are defined in the database with `is_admin = true`. The initial admin users are:
- zha.yitong@gmail.com
- yishan.zhang007@gmail.com

## Support

If you encounter any issues, check:
1. All environment variables are set correctly
2. Supabase database schema is properly created
3. Supabase magic links are configured with correct Site URL
4. Resend domain is verified