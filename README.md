# DigitalSoft — AI-Powered Lead Management & Appointment Booking Platform

A full-stack MVP that lets website visitors submit project inquiries, automatically scores them as leads, and books meetings using an RFC 5545 (iCalendar) compliant `.ics` booking system. Built for DigitalSoft's technical evaluation assignment.

---

## 1. Project Overview

DigitalSoft receives client inquiries from its website, marketing campaigns, social media, and WhatsApp referrals. Previously, this process was manual. This platform automates it end-to-end:

1. Visitors submit project requirements through a public form.
2. The system automatically scores each lead (High / Medium / Low priority).
3. Visitors can book a meeting from available time slots.
4. Booking generates a downloadable `.ics` calendar invite compatible with Google Calendar, Outlook, and Apple Calendar.
5. Internal team members log into an admin dashboard to manage the pipeline (status, notes, search, filters) and manage appointments.

---

## 2. Architecture

```
┌─────────────────┐        REST API (JSON)        ┌──────────────────┐        ┌─────────────┐
│  React Frontend  │  ───────────────────────────▶ │  Express Backend  │ ─────▶ │  MongoDB     │
│  (Vite + Tailwind)│ ◀─────────────────────────── │  (Node.js)        │        │  Atlas        │
└─────────────────┘                                └──────────────────┘        └─────────────┘
                                                            │
                                                            ▼
                                                   ┌──────────────────┐
                                                   │  ics npm package  │  → generates RFC 5545
                                                   │  (calendar files)  │    compliant .ics files
                                                   └──────────────────┘
```

**Backend follows MVC (Model-View-Controller) architecture:**
- `models/` — Mongoose schemas (Lead, Appointment, User) define the data shape.
- `controllers/` — business logic for each API endpoint.
- `routes/` — maps URLs + HTTP methods to controller functions.
- `services/` — pure business logic kept separate from controllers (lead scoring, `.ics` generation, AI summaries), so rules can change without touching controller code.
- `middleware/` — cross-cutting concerns: JWT auth, request validation, centralized error handling.

**Frontend follows a similar separation:**
- `pages/` — one component per route/screen.
- `components/` — small reusable UI pieces (StatusBadge, Sidebar, Toast, etc.)
- `services/api.js` — the only file that knows the backend's URL; all API calls go through it.
- `context/` — global auth state, shared across the app without prop-drilling.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Calendar | `ics` npm package (RFC 5545 / iCalendar standard) |
| Auth | JWT (JSON Web Tokens) + bcrypt password hashing |
| AI Bonus | Gemini API (with automatic mock fallback if no key is set) |

---

## 4. Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and fill in your MONGO_URI, JWT_SECRET, etc.
npm run dev
```

The API runs on `http://localhost:5000` by default.

**Create the first admin account** (one-time, via any API client like Postman, or curl):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@digitalsoft.com","password":"password123","role":"admin"}'
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your backend runs on a different URL
npm run dev
```

The app runs on `http://localhost:5173`.

---

## 5. Environment Variables

**Backend (`backend/.env`)**

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Port for the backend server (default 5000) |
| `JWT_SECRET` | Secret used to sign login tokens |
| `ORGANIZER_NAME` / `ORGANIZER_EMAIL` | Shown as the meeting organizer inside `.ics` files |
| `GEMINI_API_KEY` | Optional — enables real AI summaries. Leave blank to use the built-in mock summary generator |

**Frontend (`frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## 6. Database Design

**Leads collection** — one document per inquiry. Stores the visitor's details, the calculated `score` and `priority`, pipeline `status`, and an array of internal `notes` (kept as an array rather than a single field, so note history isn't lost).

**Appointments collection** — references a Lead via `leadId` (a MongoDB ObjectId, similar to a foreign key in SQL). Stores meeting time, status, and the generated `.ics` file content itself, so it can be re-downloaded without regenerating it.

**Users collection** — internal team accounts with hashed passwords and a `role` (admin / analyst / viewer) for future permission expansion.

**Design decision:** Rather than storing `.ics` files on disk, we store the generated file content directly as a string field in MongoDB. This keeps deployment simpler (no file storage service needed) at the cost of slightly larger documents — a reasonable tradeoff for this data volume.

---

## 7. API Documentation

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public (setup only) | Create a team user |
| POST | `/api/auth/login` | Public | Log in, returns a JWT |

### Leads
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/leads` | Public | Submit a new lead |
| GET | `/api/leads?search=&status=&priority=` | Admin | List/search/filter leads |
| GET | `/api/leads/:id` | Admin | Get one lead |
| PUT | `/api/leads/:id/status` | Admin | Update status / add a note |
| DELETE | `/api/leads/:id` | Admin | Delete a lead |

### Appointments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/appointments` | Public | Book a meeting (by `leadEmail` or `leadId`) |
| GET | `/api/appointments` | Admin | List all appointments |
| PUT | `/api/appointments/:id` | Admin | Reschedule or cancel |
| DELETE | `/api/appointments/:id` | Admin | Delete an appointment |

### Calendar
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/calendar/availability?date=YYYY-MM-DD` | Public | Get free/booked 1-hour slots |
| GET | `/api/calendar/export/:id` | Public | Download the `.ics` file for a booking |

All endpoints marked **Admin** require an `Authorization: Bearer <token>` header (obtained from `/api/auth/login`).

---

## 8. Calendar / iCal Integration Explanation

Rather than self-hosting a full platform like Cal.com (which is a multi-service deployment on its own and would consume most of the available project time), this system implements the iCalendar standard directly using the `ics` npm package, which produces RFC 5545 compliant `.ics` files. The assignment explicitly allows "any iCalendar RFC 5545 compatible implementation," and `.ics` is the actual file format Google Calendar, Outlook, and Apple Calendar all read — so compatibility is achieved at the file-format level rather than by depending on a specific external service.

Availability is calculated server-side (9 AM–5 PM, 1-hour slots, Monday portrayed as any weekday for simplicity) by checking existing non-cancelled appointments against a generated slot list.

**Future improvement:** integrate two-way sync with Google Calendar's API so admin-side changes reflect automatically in the organizer's own calendar, not just the invitee's.

---

## 9. Lead Scoring Logic

Located in `backend/services/leadScoringService.js`:

- Budget ≥ $20,000 → +30 | $10,000–$20,000 → +20 | below $10,000 → +10
- Urgent timeline → +20
- Company website provided → +10
- Service type (AI Solution / ERP-CRM = +20, Web Dev / Mobile = +10) — **added beyond the original spec**, because the assignment's example rules only total 60 points maximum, but its priority labels assume 80+ is reachable for "High Priority." This addition closes that gap while staying true to the spirit of the rules.

Final labels: 80+ → High Priority, 50–80 → Medium Priority, below 50 → Low Priority.

---

## 10. Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | `vercel.json` included with SPA rewrites so React Router routes don't 404 on refresh |
| Backend | Render (or Docker anywhere) | `render.yaml` blueprint and `Dockerfile` both included |
| Database | MongoDB Atlas | Free tier (M0) is sufficient for this MVP |

**Steps:**
1. Push this repo to GitHub.
2. Create a MongoDB Atlas cluster → copy the connection string into Render's environment variables.
3. Deploy `backend/` to Render (or build the Docker image and deploy anywhere that runs containers).
4. Deploy `frontend/` to Vercel, setting `VITE_API_URL` to your deployed backend's URL.
5. Register the first admin account using the curl command in Section 4.

---

## 11. Demo Credentials

After running the registration command in Section 4, use:
- **Email:** admin@digitalsoft.com
- **Password:** password123

*(Change this before any real/public deployment.)*

---

## 12. Future Improvements

- Real-time updates (WebSockets) so multiple admins see status changes instantly.
- Email notifications on lead submission and booking confirmation.
- Two-way Google Calendar sync for the organizer's own calendar.
- Role-based UI restrictions (currently role is stored but not yet enforced in the frontend UI).
- Pagination for the leads table once volume grows beyond a few hundred records.

---

## 13. Folder Structure Reference

```
digitalsoft-leads/
├── backend/
│   ├── config/          # Database connection setup
│   ├── controllers/      # Request handling + business logic
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoint definitions
│   ├── services/         # Scoring engine, .ics generator, AI summary
│   ├── utils/            # Small helper functions (ID generation)
│   ├── server.js         # App entry point
│   ├── Dockerfile
│   └── render.yaml
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI pieces
    │   ├── context/      # Global auth state
    │   ├── pages/        # One component per screen
    │   └── services/     # Centralized API calls
    └── vercel.json
```
