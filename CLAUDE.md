# Build a wedding site for Yishan and Yitong

This is a wedding website for Yishan and Yitong. There are two kinds of users: 

1. Admin (Yishan and Yitong. Our Emails are zha.yitong@gmail.com and yishan.zhang007@gmail.com)
2. Guests (Everyone else. Full list of emails will be provided later. For now, use cfeng.charlie@gmail.com and yitong@votegora.com as the test guests)

## Data structure
1. We should store guests to track their RSVP status. Every guest should have
1.1. Whether they have RSVP'ed as coming or not
1.2. If any dietary preference for themself (freeform text)
1.3. Whether they have a +1
1.4. If any dietary preference for their +1 (freeform text)
1.5. Name of their +1
1.6. Email of their +1
1.7. Date at which they've completed their attendance response.
1.8. Additional notes

## Key functionality
1. Anyone can view a home page with key information about the wedding
2. Guests can then sign in to see additional information: exact venue, timing of the event, and a form to provide their RSVP.
3. Admins can sign in to see a list of guest and all the information they've provided
4. Admin can send 2 types of emails: first is the save the date. Second is the reminder.

## The tech stack
1. Next.js + shadcn. But keep things as minimal as possible to start
2. Use Resend for email. See this: https://resend.com/docs/send-with-nextjs
3. Use React email for the email templates.
3. Use Supabase for Backend
4. Use Supabase for Auth 
5. Vercel for frontend

In general, keep things as simple as possible. we can always add more later.

If you need access to any of the dev tools, please ask me

## FAQs for Claude:

Wedding Details:
1. What's the wedding date and time? October 4th 2025
2. What's the venue name and address? Penny Roma, 3000 20th St, San Francisco, CA 94110
3. Any specific theme/colors you'd like for the website? keep it styling free. i will hand code style later

Guest Management:
1. Should guests be able to invite multiple +1s or just one?  just one
2. Do you want guests to upload photos or just view info? no uploads. just view info and indicate their RSVP
3. Should there be any gift registry integration? no

Email Templates:
1. What should the "Save the Date" email contain? Make up some simple placeholder content for now
2. What should the "Reminder" email contain? Make up some simple placeholder content for now
3. Any specific branding/styling for emails? No styling. I will do it myself.

Technical Setup:
1. Do you already have Supabase, Resend, and Vercel accounts set up? Yes, let me know what you need to access
2. Any specific domain you want to use? I bought yishanandyitong.
wedding on vercel

Authentication:
1. Should guests create passwords or use magic links? no keep it simple and ask everyone to auth via google
2. Any specific signup flow preferences? keep it as simple as possible

