# DigitalSoft — Lead Management & Appointment Booking Platform

This is a full-stack MVP built for DigitalSoft's technical evaluation. It handles the whole flow from a visitor submitting a project inquiry, to that inquiry being scored and tracked internally, to booking an actual meeting with a downloadable calendar invite.

## What it does

- Visitors fill out a project inquiry form on the public site.
- Every submission gets scored automatically (budget, timeline, service type) and labeled High/Medium/Low priority.
- Visitors can book a meeting from available time slots, and get a `.ics` calendar file they can drop into Google Calendar, Outlook, or Apple Calendar.
- The internal team logs into an admin dashboard to search/filter leads, update pipeline status, add notes, and manage bookings (view, cancel, reschedule, export).

## Tech stack

Frontend is React (Vite) with Tailwind CSS, React Router, and Axios. Backend is Node/Express with MongoDB via Mongoose. Auth is JWT-based with bcrypt password hashing. Calendar invites are generated with the `ics` package, which produces standard RFC 5545 files — the same format Google/Outlook/Apple all read — so there was no need to stand up something like Cal.com just for this.

## How it's organized

The backend follows a fairly standard MVC split:

- `models/` — Mongoose schemas for Lead, Appointment, and User
- `controllers/` — the actual logic behind each endpoint
- `routes/` — just wires URLs to controllers, no logic here
- `services/` — scoring rules, `.ics` generation, and the AI summary feature live here on purpose, separate from controllers, so the business rules can change without touching request-handling code
- `middleware/` — JWT auth, request validation, centralized error handling

The frontend mirrors that separation: `pages/` for each screen, `components/` for the reusable bits, `services/api.js` as the single place that knows the backend URL, and `context/` for auth state.

## Running it locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env` with your MongoDB connection string and a JWT secret, then:
```bash
npm run dev
```
It runs on port 5000.

Create the first admin account (one-time):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin\",\"email\":\"admin@digitalsoft.com\",\"password\":\"YourPassword123\",\"role\":\"admin\"}"
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs on port 5173.

## Environment variables

Backend needs `MONGO_URI`, `JWT_SECRET`, and optionally `GEMINI_API_KEY` for real AI summaries (if it's left blank, a rule-based mock summary is used instead so the feature still works without a paid key). `ORGANIZER_NAME`/`ORGANIZER_EMAIL` show up as the meeting organizer inside the `.ics` files.

Frontend just needs `VITE_API_URL` pointing at wherever the backend is running.

## Database

Three collections: `leads`, `appointments`, and `users`. Appointments reference their lead through `leadId`. Notes on a lead are stored as an array (not a single field) so history isn't lost when an admin adds a new one. The generated `.ics` content is stored directly on the appointment document as a string — simpler than wiring up file storage for something this size.

## API endpoints

**Auth:** `POST /api/auth/register`, `POST /api/auth/login`

**Leads:** `POST /api/leads` (public submission), `GET /api/leads` (search/filter, admin), `GET /api/leads/:id`, `PUT /api/leads/:id/status`, `DELETE /api/leads/:id`

**Appointments:** `POST /api/appointments` (public booking, by email), `GET /api/appointments` (admin), `PUT /api/appointments/:id` (reschedule/cancel), `DELETE /api/appointments/:id`

**Calendar:** `GET /api/calendar/availability?date=YYYY-MM-DD`, `GET /api/calendar/export/:id`

Admin routes require an `Authorization: Bearer <token>` header from the login response.

## A couple of decisions worth explaining

The assignment's example scoring rules only add up to 60 points max (30 for budget + 20 for urgent timeline + 10 for a website), but the priority labels assume 80+ is reachable for "High Priority." I added a service-type bonus (+20 for AI Solution/ERP-CRM, +10 for Web Dev/Mobile) to close that gap, since those are DigitalSoft's higher-value service lines anyway.

Lead status can be changed manually by an admin, or gets set automatically to "Meeting Scheduled" when a booking comes through — both paths exist because in practice, some deals get confirmed over a call or WhatsApp before ever touching the booking system, so the status field needed to stay editable independent of the booking flow.

Reschedule/cancel are admin-only actions, matching what the assignment specifies — visitors book through the public flow, and any changes after that go through the team.

## Deployment

Frontend deploys to Vercel (`vercel.json` handles the SPA routing so refreshing on e.g. `/admin/dashboard` doesn't 404). Backend deploys to Render (`render.yaml` included) or anywhere that can run the included `Dockerfile`. Database is MongoDB Atlas, free tier is enough for this.

## What I'd add next

Real-time status updates across multiple admin sessions, email notifications on submission/booking, two-way Google Calendar sync for the organizer's side, and pagination on the leads table once volume grows.