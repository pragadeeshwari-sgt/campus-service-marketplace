# Campus Service Marketplace — Project Outline

## 1. Concept
A marketplace where students offer/request campus services (tutoring, design,
photography, notes, event help). Two-sided: any user can act as a **requester**
(orders a service) and/or a **provider** (lists a service). Admin moderates.

---

## 2. Roles
| Role     | Capabilities |
|----------|-------------|
| USER     | Browse/search, request services, review completed orders, manage own profile |
| PROVIDER | Same as USER *plus* create/manage listings, accept/reject/update requests |
| ADMIN    | Moderate listings/users, suspend accounts, view reports |

> Simplify: don't make PROVIDER a separate signup type. Every user has a
> `isProvider` flag or a `roles: ['USER']` array — anyone can create a listing
> and become a provider. ADMIN is assigned manually / seeded.

---

## 3. Core Entities & Relationships (PostgreSQL recommended — this project
is inherently relational: users ↔ listings ↔ requests ↔ reviews)

### Tables

**users**
- id, name, email (unique), password_hash, bio, is_admin, is_suspended, created_at

**categories**
- id, name (Tutoring, Design, Photography, Notes, Event Help, ...)

**listings**
- id, provider_id (FK → users), category_id (FK → categories), title,
  description, price, is_active, is_flagged, created_at

**service_requests**
- id, listing_id (FK), requester_id (FK → users), provider_id (FK → users),
  status ENUM('REQUESTED','ACCEPTED','IN_PROGRESS','COMPLETED','REVIEWED','REJECTED','CANCELLED'),
  requested_at, accepted_at, completed_at, notes

**reviews**
- id, service_request_id (FK, unique), reviewer_id, rating (1-5), comment, created_at

**reports** (for admin moderation)
- id, reported_by, target_type ('user'|'listing'), target_id, reason, status, created_at

---

## 4. Status Workflow (mandatory core feature)

Rules to enforce **server-side** (not just UI):
- Only the provider can move REQUESTED → ACCEPTED/REJECTED
- Only the provider can move ACCEPTED → IN_PROGRESS
- Only the provider can move IN_PROGRESS → COMPLETED
- Only the requester can move COMPLETED → REVIEWED (by submitting a review)
- No skipping states — validate the transition, not just the target status
- Store timestamps per transition for the dashboard/history view

---

## 5. API Structure (REST)

Every route returns consistent error shape:
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

---

## 6. Security Checklist
- [ ] Passwords hashed with bcrypt (never store plain text)
- [ ] JWT in httpOnly cookie (or Authorization header) — set short expiry + refresh if time allows
- [ ] `authenticate` middleware (verifies JWT) + `authorize(role)` middleware
- [ ] Input validation with `express-validator` on every POST/PATCH
- [ ] Rate limiting on `/auth/login` and `/auth/register` (express-rate-limit)
- [ ] Ownership checks (a provider can't update someone else's listing/request)
- [ ] `.env` for JWT_SECRET, DB_URL, PORT — never committed (already in .gitignore)

---

## 7. Frontend Pages / Dashboard
- `/` — browse listings (search + category filter)
- `/login`, `/register`
- `/listings/:id` — detail + request button
- `/dashboard` — role-aware:
  - "My Requests" (as requester) with status pills
  - "Incoming Requests" (as provider) with accept/reject/update actions
  - "My Listings" (create/edit)
- `/admin` — user list, flagged listings, suspend/moderate actions
- Loading skeletons, empty states ("No requests yet"), and error banners on every data view

---

## 8. Suggested Commit Milestones (for a clean, meaningful git history)
1. `chore: initial scaffold`
2. `feat: user model + register/login (JWT + bcrypt)`
3. `feat: auth middleware + protected routes`
4. `feat: category + listing CRUD`
5. `feat: listing search/filter API`
6. `feat: service request model + status workflow`
7. `feat: status transition validation (role-based)`
8. `feat: reviews`
9. `feat: admin moderation endpoints`
10. `feat: frontend auth pages`
11. `feat: frontend browse/search`
12. `feat: frontend dashboard (requester + provider views)`
13. `feat: frontend admin panel`
14. `feat: responsive layout pass`
15. `chore: error/loading/empty states`
16. `docs: README + API docs`
17. `chore: deployment config`

---

## 9. Deployment
- Frontend → Vercel or Netlify (free tier, auto-deploy from `main`)
- Backend → Render or Railway (free tier Postgres included on Render)
- Set env vars in the hosting dashboard, not in code

---

## 10. README.md should include
- Project description + status workflow diagram
- Tech stack
- Setup instructions (local + env vars needed)
- API documentation link (or table)
- Live demo links (frontend + backend)
- Screenshots
