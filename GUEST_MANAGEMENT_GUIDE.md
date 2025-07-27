# Wedding Guest Management Guide

## Overview

Your wedding website has a complete guest management system with the following features:
- Only guests in your database can sign in (prevents crashers)
- Passwordless authentication via magic links
- Beautiful RSVP emails
- Admin dashboard to track RSVPs

## Step 1: Add Your Guest List

### Option A: Using Supabase Dashboard (Easiest)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Table Editor → `guests` table
4. Click "Insert rows" and add each guest with:
   - `email`: Guest's email (required)
   - `name`: Guest's full name (optional but recommended)
   - `is_admin`: Set to `false` for all guests
   - Leave other fields empty

### Option B: Using SQL
1. Edit `scripts/add-guests.sql` with your guest list
2. Go to Supabase Dashboard → SQL Editor
3. Paste and run the SQL

### Option C: Bulk Import Script
1. Edit `scripts/add-guests.js` with your guest list
2. Run: `node scripts/add-guests.js`

## Step 2: Send RSVP Emails

1. Go to: `https://your-site.com/admin`
2. Sign in with your admin email:
   - zha.yitong@gmail.com
   - yishan.zhang007@gmail.com

3. In the admin dashboard, you'll see:
   - Total guests count
   - Number of RSVPs received
   - Attendance statistics
   - Email send buttons

4. Click **"Send RSVP Reminder"** to email all guests

## Step 3: Guest RSVP Flow

When guests receive the email:

1. They click "RSVP Now" in the email
2. On your website, they click "Sign in to RSVP"
3. They enter their email (must be in your guest list)
4. They receive a magic link via email
5. Clicking the link signs them in automatically
6. The RSVP form appears where they can:
   - Indicate if they're attending
   - Add dietary preferences
   - Add plus-one information
   - Leave notes

## Important Notes

### Email Configuration
- Make sure `RESEND_API_KEY` is set in your environment variables
- Update the email domain in `src/emails/reminder.tsx` if needed
- The current link in emails goes to `https://yishanandyitong.wedding`

### Security Features
- Only emails in your guest list can sign in
- Guests can only see/edit their own RSVP
- Only admins can see all guest information

### Tracking RSVPs
In the admin dashboard, you can see:
- Who has RSVP'd (green badge)
- Who is attending vs not attending
- Who is bringing a plus-one
- Dietary preferences and notes

## Troubleshooting

### Guests Can't Sign In
- Verify their email is in the `guests` table
- Check for typos in the email address
- Make sure they're checking the correct inbox for magic links

### Emails Not Sending
- Check that `RESEND_API_KEY` is configured
- Verify your Resend domain is set up correctly
- Check the browser console for errors in admin dashboard

### Need to Update Guest Info
- Use Supabase Dashboard to edit guest records
- Or create an update SQL script similar to the add script 