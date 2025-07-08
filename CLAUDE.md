# Build a wedding site for Yishan and Yitong

This is a wedding website for Yishan and Yitong. There are two kinds of users: 

1. Admin (Yishan and Yitong. Our Emails are zha.yitong@gmail.com and yishan.zhang007@gmail.com)
2. Guests (Everyone else. Full list of emails will be provided later. For now, use cfeng.charlie@gmail.com and yitong@votegora.com as the test guests)

Data structure
1. We should store guests to track their RSVP status. Every guest should have
1.1. Whether they have RSVP'ed as coming or not
1.2. If any dietary preference for themself (freeform text)
1.3. Whether they have a +1
1.4. If any dietary preference for their +1 (freeform text)
1.5. Name of their +1
1.6. Email of their +1
1.7. Date at which they've completed their attendance response.
1.8. Additional notes

Key functionality
1. Anyone can view a home page with key information about the wedding
2. Guests can then sign in to see additional information: exact venue, timing of the event, and a form to provide their RSVP.
3. Admins can sign in to see a list of guest and all the information they've provided
4. Admin can send 2 types of emails: first is the save the date. Second is the reminder.

The tech stack
1. Next.js + shadcn. But keep things as minimal as possible to start
2. Use Resend for email. See this: https://resend.com/docs/send-with-nextjs
3. Use React email for the email templates.
3. Use Supabase for Backend
4. Use Supabase for Auth 
5. Vercel for frontend