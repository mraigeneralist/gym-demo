# JERAI FITNESS — For the Gym Owner

## What Is This?
This is a **working prototype** of a gym management website. It's a custom-built web application that lets your members sign up, book classes, track their progress, and manage their membership — all from their phone or computer. It also gives you (the owner) an admin dashboard to manage everything.

Think of it as your gym's own app, but it runs in a web browser so there's nothing to download.

---

## Who Is It For?

### Your Members Can:
- **Sign up and log in** with their email and password
- **Browse the class schedule** and see what's available each day
- **Book classes with one click** — they see how many spots are left
- **Get waitlisted automatically** if a class is full (they get promoted if someone cancels)
- **Cancel bookings** — the next person on the waitlist gets the spot
- **View a digital membership card** with a QR code (for check-in at the front desk)
- **Track their fitness progress** — log body weight, lifts (bench, squat, deadlift), and see charts over time
- **See the Workout of the Day** posted by your trainers
- **Check the leaderboard** to see who's attended the most classes this month
- **Share a referral code** to invite friends

### You (the Admin) Can:
- **View all members** and their membership status
- **Create, edit, and delete classes** on the schedule
- **See all bookings** across every class
- **Post the Workout of the Day** for members to follow
- **View a revenue summary** from memberships
- **Switch between admin view and member view** anytime

---

## Feature Tour

### Public Pages (No Login Needed)
- **Homepage** — A professional landing page with gym stats, testimonials, and call-to-action buttons
- **Class Schedule** — Full weekly schedule showing all classes, times, instructors, and capacity
- **Pricing** — Three membership tiers (Basic $29/mo, Pro $49/mo, Elite $79/mo) with feature comparison
- **About** — Your gym's story, values, and trainer profiles
- **Contact** — A contact form and your gym's location, phone, email, and hours

### Member Portal (After Login)
- **Dashboard** — Overview of upcoming classes, membership status, attendance count, today's workout, and referral code
- **Book a Class** — Browse available classes, see spots remaining, book or join waitlist
- **My Bookings** — View upcoming and past bookings, cancel with one click
- **Membership Card** — Digital card with name, plan, QR code, and referral code
- **Progress Tracker** — Log weight, bench press, squat, deadlift, body fat. See line charts tracking progress over time
- **Leaderboard** — Monthly ranking by class attendance

### Admin Dashboard
- **Overview** — Total members, active memberships, today's bookings, revenue at a glance
- **Members** — Full table with name, phone, referral code, membership plan, status, join date
- **Classes** — Create new classes, edit existing ones, delete old ones. Set name, type, instructor, day, time, capacity
- **Bookings** — See every booking with date, class, member name, and status
- **Workout of the Day** — Post new workouts with exercises (name, sets, reps), view past WODs

---

## How the Booking & Waitlist System Works

1. A member opens **Book a Class** and sees this week's schedule
2. Each class shows available spots (e.g., "12 / 20 spots")
3. If spots are available: they click **Book Now** → instant confirmation
4. If the class is full: they click **Join Waitlist** → they're added to the queue with a position number
5. If someone cancels: the first person on the waitlist is **automatically promoted** to confirmed
6. The system logs an "email sent" message (in a real version, this would send an actual email)

---

## How Member Data Is Stored and Kept Private

- All data is stored in **Supabase**, a secure cloud database (like a bank vault for your data)
- Every table has **Row Level Security (RLS)** — this means:
  - Members can **only see their own** bookings, progress logs, and membership
  - Members **cannot see** other members' personal data
  - Only admins can see all members and all bookings
- Passwords are **never stored directly** — Supabase uses industry-standard encryption
- The database is hosted on secure servers with automatic backups

---

## What Is Supabase?

Supabase is the technology that powers the "backend" of this website. In simple terms:
- It stores all your data (members, bookings, classes, etc.) in a secure database
- It handles user login and signup securely
- It enforces privacy rules so members only see their own data
- It's a trusted platform used by thousands of companies
- It has a free tier that works for small-to-medium gyms

You don't need to understand how it works — it runs automatically in the background.

---

## What Would Need to Happen to Go Live

This prototype is fully functional but needs a few things before real members use it:

### Must-Have
1. **Real payment processing** — Connect Stripe (the payment system) so members actually pay. Right now the checkout page is a demo that doesn't charge real money
2. **Real email notifications** — Set up email so members get booking confirmations, waitlist promotions, and welcome emails. Right now these are logged but not sent
3. **Custom domain** — Register a domain like `jeraifitness.com` and point it to the live site
4. **SSL certificate** — Comes free with Vercel/domain setup. Ensures the site is secure (https://)

### Nice-to-Have
5. **Profile photos** — Let members and trainers upload photos (uses Supabase Storage)
6. **Password reset flow** — "Forgot password?" email link
7. **Email templates** — Branded emails for confirmations and reminders
8. **Push notifications** — Remind members about upcoming classes
9. **Analytics** — Track which classes are most popular, busiest times, member retention

### Estimated Effort
- Payment + email integration: ~1-2 weeks of development
- Domain setup + deployment: ~1 day
- Everything else: incremental improvements over time

---

## Ongoing Maintenance

Once live, this site needs very little maintenance:

- **Supabase** handles database backups, security updates, and uptime automatically
- **Vercel** (the hosting platform) handles deployment, SSL, and performance
- **Your ongoing tasks**: Post daily WODs, manage the class schedule, and view reports through the admin dashboard
- **Cost**: Supabase free tier covers up to ~50,000 monthly active users. Vercel free tier covers hobby use. For a production gym, expect ~$25-50/month total

---

## Glossary

| Term | What It Means |
|------|--------------|
| **Frontend** | The part of the website users see and interact with (pages, buttons, forms) |
| **Backend** | The server-side part that stores data and handles logic (Supabase) |
| **Database** | Where all the gym's data is stored (members, bookings, classes, etc.) |
| **API** | How the website talks to the database (happens automatically) |
| **Auth/Authentication** | The login/signup system that verifies who someone is |
| **RLS (Row Level Security)** | Database rules that prevent members from seeing each other's data |
| **Middleware** | Code that runs before a page loads to check if the user is logged in |
| **Route** | A URL path like `/dashboard` or `/admin/classes` |
| **Server Component** | A page that loads data on the server before sending it to the browser (faster) |
| **Client Component** | A page with interactive elements like forms and buttons |
| **Deployment** | Putting the website on the internet so anyone can access it |
| **Vercel** | The platform that hosts and serves the website |
| **Stripe** | A payment processing service (like a digital cash register) |
| **QR Code** | The square barcode on the membership card (scannable at the front desk) |
| **Waitlist** | A queue for full classes — members get promoted automatically when a spot opens |
| **WOD** | Workout of the Day — a daily exercise plan posted by trainers |
