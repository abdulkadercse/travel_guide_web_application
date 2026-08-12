# Travel Guide Web Application — Module Build Prompts

Goal: make the codebase match the already-submitted `travel_srs.md` exactly. The SRS is frozen; the code changes, never the SRS.

Run one module at a time. Paste **Section A** followed by that module's prompt. Verify with the module's checklist, commit, then move to the next module.

---

## Known Gaps Against the SRS

| # | SRS requirement | Current code | Fixed in |
|---|---|---|---|
| 1 | §7.2 — backend is Node.js + Express.js as a separate Application Server Layer | No Express; logic lives in Next.js route handlers | Module 0 + 1 |
| 2 | §8 — reservation requests for hotels **and restaurants** | `Reservation` has no `restaurantId` | Module 0 + 11 |
| 3 | §8 — authentication includes password management | Only login and refresh-token exist | Module 2 |
| 4 | §12 — Database Design and ER Diagram deliverable | Missing | Module 15 |
| 5 | §6.2 — upload **and manage** images | Upload only; no delete or gallery management | Module 12 |
| 6 | SRS defines travellers and administrators only | Schema has unused `GUIDE` and `COMPANY` roles | Module 0 |

## Known Defects in the Current Code

| # | Defect | Impact | Fixed in |
|---|---|---|---|
| 1 | `verifyAuth` is called on 1 of 26 endpoints (`/api/auth/me` only) | Anyone can create or delete destinations, delete users, without a token | Module 1 |
| 2 | `userId` is read from the query string in the favorite, tripPlan and reservation routes | Changing a URL exposes another user's data | Module 1 |
| 3 | Six frontend files call `fetch("/api/...")` directly, bypassing RTK Query | Breaks when the API moves; also violates the SRS §9 stack | Module 1 |
| 4 | `src/.env` is in the wrong place — Next.js reads `.env` from the project root only | Environment variables are likely not loading | Module 0 |
| 5 | No `prisma/migrations/`, no seed script | The database cannot be rebuilt on another machine; no demo data | Module 0 |
| 6 | `(prisma as any)` casts, no central error handler, no pagination | No type safety; inconsistent error responses | Module 0 + 1 |
| 7 | `src/app/demo/page.tsx`, unused starter SVGs, duplicate barrel exports | Dead code in a submitted project | Module 14 |

---

## Section A — Shared Context

Paste this block at the start of every module prompt.

```
CONTEXT — read before writing any code.

PROJECT: Travel Guide Web Application. The SRS (travel_srs.md in the repo root) is already
submitted to the university and is FROZEN. The code must match the SRS, never the reverse.
If anything you are asked to build appears to contradict the SRS, stop and say so instead
of silently deviating.

ARCHITECTURE (SRS section 7) — three separate layers:
  1. User Interface Layer  -> Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
                              + Redux Toolkit + RTK Query. Repo root.
  2. Application Server Layer -> Node.js + Express.js + TypeScript, REST API,
                              JWT auth, bcrypt hashing. Lives in server/.
  3. Database Layer        -> PostgreSQL + Prisma ORM. Owned by server/ (server/prisma).

TECH STACK IS FIXED by SRS section 9. Do not introduce any library that replaces a listed
one (no Mongo, no Drizzle, no tRPC, no GraphQL, no NextAuth, no axios-instead-of-RTK-Query,
no other CSS framework). Any additional package must be asked about first.

BACKEND CONVENTIONS (server/): follow the existing modular pattern exactly —
  server/src/modules/<name>/<name>.interface.ts   (types)
  server/src/modules/<name>/<name>.validation.ts  (zod schemas, one exported object)
  server/src/modules/<name>/<name>.services.ts    (all Prisma calls, *DB suffix)
  server/src/modules/<name>/<name>.controller.ts  (catchAsync + sendResponse)
  server/src/modules/<name>/<name>.route.ts       (express.Router, auth + validateRequest)
  registered in server/src/routes/index.ts under /api/v1/<plural-name>
Use the shared helpers: catchAsync, sendResponse, ApiError, pick, and the middlewares
auth(...roles), validateRequest(schema), globalErrorHandler, notFound.
Never throw a bare Error — always `throw new ApiError(httpStatus.X, "message")`.

RESPONSE SHAPE (every endpoint, no exceptions):
  success: { success: true, statusCode: number, message: string, meta?: {page,limit,total}, data: T }
  failure: { success: false, statusCode: number, message: string, errorMessages: [{path,message}] }

SECURITY RULES: userId and role ALWAYS come from the JWT via the auth middleware, never
from the request body or query. Passwords are never selected into any response. Every
admin-only route is wrapped in auth(UserRole.ADMIN, UserRole.SUPER_ADMIN).

FRONTEND CONVENTIONS: This is Next.js 16.2.12 with React 19 — NOT the Next.js in your
training data. Read the relevant guide in node_modules/next/dist/docs/01-app/ BEFORE
writing pages, layouts, metadata, or caching code. Data fetching is RTK Query only
(baseApi.injectEndpoints in src/redux/features/<feature>/<feature>Api.ts, new tagTypes
registered in src/redux/api/baseApi.ts) — never call fetch() from a component. Reuse the
existing shared components (FormInput, FormSelect, FormTextarea, Container, ImageUploader,
AvatarUploader, ProtectedRoute) and the shadcn primitives in src/components/ui. Forms =
react-hook-form + zod via @hookform/resolvers. Toasts = react-hot-toast. Dark mode
(next-themes) must work and every page must be responsive from 360px up.

SCOPE RULE: touch only the files this task names. Do not refactor unrelated modules.
When done, print: files created, files modified, endpoints added, and manual test steps.
```

---

## Section B — SRS Traceability

| SRS reference | Requirement | Module |
|---|---|---|
| §7.1 | UI Layer — Next.js / React / TypeScript / Tailwind | all frontend modules |
| §7.2 | Application Server Layer — Node.js / Express / TypeScript / REST | 0, 1 |
| §7.3 | Database Layer — PostgreSQL / Prisma | 0 |
| §8 Auth | User registration | 2 |
| §8 Auth | Secure login / logout | 2 |
| §8 Auth | JWT-based authentication | 0, 2 |
| §8 Auth | Password management | 2 |
| §8 Auth | Role-based access control | 0, 1, 3 |
| §8 Destination | Listing, search, category filter, location filter, details, gallery | 4 |
| §8 Destination | Favorite management | 9 |
| §8 Hotel/Restaurant | Hotel listing | 5 |
| §8 Hotel/Restaurant | Restaurant listing | 6 |
| §8 Hotel/Restaurant | Service details | 5, 6 |
| §8 Hotel/Restaurant | Ratings and reviews | 8 |
| §8 Hotel/Restaurant | Reservation requests | 11 |
| §8 Transportation | Bus / train / flight / car rental, route, operator, cost, duration | 7 |
| §8 Trip Planner | Create plans, multiple destinations, notes, budget, schedule | 10 |
| §8 Review | Submit, rate, edit own, admin monitor and remove | 8 |
| §6.1 | Manage personal profiles | 3 |
| §6.2 | Manage user accounts | 3 |
| §6.2 | Manage destinations / hotels / restaurants / transportation | 4, 5, 6, 7 |
| §6.2 | Upload and manage images | 12 |
| §6.2 | Monitor reviews and ratings | 8, 12 |
| §6.2 | Manage reservation requests | 11 |
| §6.2 | View system statistics | 12 |
| §5 | Search, filtering, sorting, recommendation | 4, 13 |
| §10 Phase 4 | Functional / API / security / responsive testing | 14, 15 |
| §12 | ER diagram, API documentation, testing report, deployment configuration | 15 |

---

## Section C — Target Structure

```
travel_guide_web_application/
├── server/                          Application Server Layer (SRS 7.2)
│   ├── package.json                 express, cors, zod, jsonwebtoken, bcryptjs,
│   │                                @prisma/client, cloudinary, multer, dotenv, ts-node-dev
│   ├── tsconfig.json
│   ├── .env / .env.example
│   ├── prisma/
│   │   ├── schema.prisma            moved from the repo root
│   │   └── seed.ts
│   └── src/
│       ├── server.ts                bootstrap, prisma connect, listen
│       ├── app.ts                   express app, cors, json, /api/v1, error handlers
│       ├── config/index.ts          typed env loader
│       ├── routes/index.ts          root router -> all module routers
│       ├── middlewares/
│       │   ├── auth.ts              auth(...roles) -> JWT verify + role check
│       │   ├── validateRequest.ts   zod schema validator
│       │   ├── globalErrorHandler.ts
│       │   └── notFound.ts
│       ├── shared/
│       │   ├── prisma.ts            PrismaClient singleton
│       │   ├── catchAsync.ts
│       │   ├── sendResponse.ts
│       │   ├── ApiError.ts
│       │   └── pick.ts
│       ├── utils/
│       │   ├── jwtHelpers.ts
│       │   └── cloudinary.ts
│       └── modules/
│           ├── auth/  user/  destination/  hotel/  restaurant/
│           ├── transportation/  review/  favorite/  tripPlan/
│           └── reservation/  stats/  upload/
│
└── src/                             User Interface Layer (SRS 7.1), frontend only
    ├── app/                         pages and layouts only — no api/, no modules/
    ├── components/  redux/  lib/  types/  utils/
```

Ports: backend `http://localhost:5001`, API prefix `/api/v1`, frontend `http://localhost:3000`.

### What happens to the existing code

| Today | After Module 0 + 1 | Reason |
|---|---|---|
| `src/app/modules/<x>/{interface,validation,services,controller,route}.ts` | moved to `server/src/modules/` with the same file names and pattern | this pattern is already the standard Express modular layout |
| `*.services.ts` (plural) with `*DB` suffixes | unchanged | existing project convention |
| `*.controller.ts` | gains `catchAsync` + `sendResponse`; validation moves to the route | Express standard |
| `*.route.ts` exporting `handleXxx(request)` | becomes an `express.Router()` | SRS §7.2 |
| `src/app/api/**` | deleted | Express is the API layer now |
| `src/lib/{prisma,jwt,cloudinary,auth.middleware}.ts` | moved into `server/src/{shared,utils,middlewares}/` | backend-only code |
| `prisma/schema.prisma` | `server/prisma/schema.prisma` | the DB layer belongs to the server |
| `src/app/(commonLayout)/`, `src/app/dashboard/(admin)|(user)/` | unchanged; new pages added | structure is already correct |
| `src/components/{ui,shared,providers}/` | unchanged; new components added | |
| `src/redux/**` | unchanged except the base URL and new feature APIs | |
| `src/lib/utils.ts`, `src/utils/index.ts`, `components.json` | unchanged | |

The frontend architecture is preserved; only the backend moves into `server/`.

---

## Module 0 — Express Backend Skeleton and Schema Alignment

No features are migrated here. The existing app must keep working after this module.

```
Task: Create the Express.js Application Server Layer described in SRS section 7.2, plus
align the Prisma schema with the SRS. Do NOT migrate any existing feature yet and do NOT
touch the Next.js frontend in this task — the current app must keep working.

PART 1 — server/ bootstrap
1. Create server/ with its own package.json (name "travel-guide-server") and tsconfig.json
   (strict, target ES2022, outDir dist, rootDir src, path alias @/* -> src/*).
   Dependencies: express, cors, dotenv, zod, jsonwebtoken, bcryptjs, @prisma/client,
   cloudinary, multer, http-status. Dev: typescript, ts-node-dev, prisma, @types/*.
   Scripts: dev (ts-node-dev --respawn src/server.ts), build (tsc), start (node dist/server.js),
   seed, and prisma scripts. Check the express major version you install: if it is 5.x,
   read its breaking changes (route pattern syntax, async error forwarding) before writing
   routes.
2. server/src/config/index.ts — typed env loader (PORT, DATABASE_URL, CLIENT_URL,
   JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN,
   BCRYPT_SALT_ROUNDS, CLOUDINARY_*). Throw at startup if a required one is missing.
3. server/src/shared/: prisma.ts (PrismaClient singleton), ApiError.ts (extends Error with
   statusCode), catchAsync.ts, sendResponse.ts (emits the exact success shape from the
   shared context, with optional meta), pick.ts.
4. server/src/middlewares/:
   - auth(...requiredRoles): reads the Bearer token, verifies with jwtHelpers, attaches
     req.user = { userId, email, role }, throws ApiError 401 when missing/invalid and 403
     when the role is not allowed. Add an Express Request type augmentation for req.user.
   - validateRequest(zodSchema): parses { body, query, params }, passes ZodError onward.
   - globalErrorHandler: handles ZodError (422 with errorMessages[]), Prisma known errors
     (P2002 duplicate -> 409, P2025 not found -> 404), ApiError, and unknown errors.
     Emits the exact failure shape from the shared context. Never leak a stack in production.
   - notFound: 404 handler for unmatched routes.
5. server/src/utils/jwtHelpers.ts (createToken/verifyToken — port the logic from the current
   src/lib/jwt.ts) and cloudinary.ts (port from src/lib/cloudinary.ts).
6. server/src/app.ts: cors({ origin: config.clientUrl, credentials: true }), express.json(),
   express.urlencoded, GET /health returning { status: "ok", uptime }, mount
   routes/index.ts at /api/v1, then notFound + globalErrorHandler last.
   server/src/routes/index.ts exports a router with an empty module list for now (the array
   pattern: [{ path: "/auth", route: authRouter }, ...]).
7. server/src/server.ts: connect Prisma, listen on config.port, handle
   unhandledRejection/uncaughtException with a graceful shutdown.

PART 2 — Prisma alignment with the SRS
8. Move prisma/schema.prisma to server/prisma/schema.prisma (delete the root prisma folder)
   and point the generator output at the default location for the server package.
9. Schema changes, and ONLY these:
   - enum UserRole: remove GUIDE and COMPANY (the SRS defines only travellers and
     administrators). Keep USER, ADMIN, SUPER_ADMIN.
   - model User: remove the now-meaningless companyName field.
   - model Reservation: add `restaurantId String?` + the `restaurant Restaurant?` relation
     with onDelete: SetNull, and add the matching `reservations Reservation[]` back-relation
     on Restaurant. SRS section 8 requires reservation requests for restaurants as well as
     hotels.
10. server/prisma/seed.ts — idempotent (upsert) seed: 1 SUPER_ADMIN, 1 ADMIN, 3 USER
    accounts (bcrypt-hashed), 8 destinations across Bangladeshi districts, 4 hotels,
    4 restaurants, 6 transportations covering all four TransportType values, plus a few
    reviews. Print the demo credentials at the end.
11. server/.env.example with every key from config, using obvious placeholders only —
    never a real secret. Also replace the real-looking Cloudinary and JWT secrets currently
    committed in the root .env.example with placeholders.
12. Fix the misplaced env file: there is a src/.env in this repo. Next.js only reads .env
    files from the project ROOT, so that file is currently being ignored by the framework.
    Move every backend key from it into server/.env (DATABASE_URL, JWT_*, BCRYPT_*,
    CLOUDINARY_*) and keep only NEXT_PUBLIC_* keys in a root .env.local, then delete
    src/.env. Confirm .gitignore still covers both locations. Do not print the secret
    values in your summary.

PART 3 — docs
13. Add a "Running the project" section to README.md: two terminals (server: npm run dev on
    :5000, frontend: npm run dev on :3000), plus the DB commands
    (npx prisma migrate dev --name init, npx prisma generate, npm run seed) run from server/.
    Do not run migrations yourself.

Verify: from server/, `npx tsc --noEmit` passes and `npm run dev` starts and answers
GET http://localhost:5001/health.
```

**Checklist**
- [ ] `cd server && npm run dev` serves `http://localhost:5001/health`
- [ ] `npx prisma migrate dev --name init` and `npm run seed` both succeed from `server/`
- [ ] `schema.prisma` has no `GUIDE`/`COMPANY`, and `Reservation.restaurantId` exists
- [ ] No real secret in any `.env.example`; `src/.env` is gone
- [ ] The existing Next.js app still runs unchanged

Separate manual action: rotate the Cloudinary API secret in the Cloudinary dashboard — the old one is in git history.

---

## Module 1 — Migrate Every Existing Module to Express

```
Task: Move all existing backend modules from the Next.js API routes into the Express server
created in Module 0, then point the frontend at the new backend. This is a migration, not a
rewrite — preserve the current behaviour of every endpoint except where noted below.

1. For each of these modules currently in src/app/modules/ — auth, user, destination, hotel,
   transportation, review, favorite, tripPlan, reservation — create
   server/src/modules/<name>/ with:
   - <name>.interface.ts and <name>.validation.ts: copy as-is (they are framework-agnostic).
   - <name>.services.ts: copy the existing *.services.ts as-is (keep the plural file name
     and the *DB function suffixes — that is this project's existing convention), importing
     prisma from @/shared/prisma, and replace every `throw new Error(...)` with
     `throw new ApiError(...)` using a correct http status. Remove the `(prisma as any)`
     casts and type them properly.
   - <name>.controller.ts: wrap each handler in catchAsync, read filters with pick(),
     read the user with req.user, and emit results with sendResponse. The old
     controller's validate-then-call logic moves into the route via validateRequest.
   - <name>.route.ts: an express.Router with the same operations the old handleXxx functions
     exposed, wired as `router.get("/", auth(...), controller.x)` etc., preserving today's
     methods and paths.
2. Register every router in server/src/routes/index.ts:
   /auth, /users, /destinations, /hotels, /transportations, /reviews, /favorites,
   /trip-plans, /reservations — all under the /api/v1 prefix.
3. Port the Cloudinary upload endpoint to server/src/modules/upload/ as
   POST /api/v1/upload using multer memoryStorage (image mimetypes only, 5 MB limit),
   returning { url, public_id }.
4. AUTHORIZATION — the most important part of this migration. In the current code verifyAuth
   is called on exactly ONE endpoint (/api/auth/me); every other endpoint is completely
   unprotected. Do NOT preserve that behaviour — apply this matrix instead:
     public (no auth):  GET destinations, GET destinations/:id, GET hotels, GET hotels/:id,
                        GET restaurants, GET transportations, GET reviews
     auth() any user:   everything under /favorites, /trip-plans, /reservations (create,
                        read own, cancel own), POST/PATCH/DELETE /reviews, GET /auth/me,
                        POST /upload
     auth(ADMIN, SUPER_ADMIN): POST/PATCH/DELETE on destinations, hotels, restaurants,
                        transportations; GET /users; PATCH /users/:id/status;
                        reservation status changes; review moderation; /stats
     auth(SUPER_ADMIN): DELETE /users/:id, role changes
5. OWNERSHIP — the current code reads userId from the query string, which lets anyone read
   anyone else's data by changing a URL. Fix it during the move: in the favorite, tripPlan
   and reservation modules (see src/app/modules/favorite/favorite.route.ts,
   tripPlan.route.ts and reservation.route.ts today), the userId must come from req.user
   set by the auth middleware. Remove userId from every query schema and request body so it
   cannot be supplied by a client at all. For a normal user, list endpoints return only
   their own rows; an ADMIN passing an explicit filter may see all.
6. Frontend switch:
   - src/redux/api/baseApi.ts: baseUrl becomes
     process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1".
   - Create .env.example / .env.local entries: NEXT_PUBLIC_API_URL and
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
7. Kill every raw fetch() call in the frontend. Several components bypass RTK Query today and
   call the API directly with a ?userId= query string — they will break the moment the API
   moves, and they violate the "RTK Query only" convention. Search the whole of src/ for
   `/api/` to find them all; at minimum these are affected:
     src/components/ui/home/FeaturedDestinations.tsx  (favorites: GET, POST, DELETE)
     src/components/ui/home/FeaturedHotels.tsx
     src/app/dashboard/(user)/user/page.tsx           (reservations, trip-plans, favorites)
     src/app/dashboard/(user)/favorites/page.tsx
     src/app/dashboard/(admin)/all-users/page.tsx     (user block/role/delete)
     any component posting to /api/upload
   Replace each with the matching RTK Query hook (create the feature api file if it does not
   exist yet), drop the ?userId= parameter entirely since the server now derives it from the
   token, and keep the existing UI/UX exactly as it is — this step changes data plumbing only.
8. Delete from the frontend, only after the Express equivalents work:
   src/app/api/**, src/app/modules/**, src/lib/prisma.ts, src/lib/jwt.ts,
   src/lib/auth.middleware.ts, src/lib/cloudinary.ts. Remove @prisma/client, prisma,
   bcryptjs, jsonwebtoken, cloudinary and their @types from the ROOT package.json — the
   frontend must no longer touch the database directly (SRS section 7 layer separation).
9. Update any frontend import that pointed into src/app/modules (for example the UserRole
   type) to a local type in src/types/index.ts.

Verify: `npx tsc --noEmit` in both packages; no raw fetch("/api/...") remains in src/;
login through the UI still works end to end; GET /api/v1/destinations returns the seeded
rows; and changing a ?userId= value in any URL no longer exposes another user's data.
```

**Checklist**
- [ ] `src/app/api/` and `src/app/modules/` no longer exist
- [ ] Root `package.json` has no prisma / bcryptjs / jsonwebtoken / cloudinary
- [ ] `http://localhost:5001/api/v1/destinations` returns data
- [ ] Login works from the UI with no CORS errors
- [ ] `npx tsc --noEmit` is clean in both packages
- [ ] No raw `fetch("/api/...")` left in the frontend
- [ ] `POST /api/v1/destinations` without a token returns 401 (it returned 201 before)
- [ ] Substituting another user's id in a URL no longer reveals their favorites or trip plans

---

## Module 2 — Authentication

Covers SRS §8: user registration, secure login/logout, JWT authentication, password management, role-based access control.

```
Task: Complete the auth module so every bullet under "Authentication" in SRS section 8 is
implemented: user registration, secure login/logout, JWT-based authentication, password
management, and role-based access control.

Backend (server/src/modules/auth):
1. POST /api/v1/auth/register — zod-validated (name, email, phone optional, password min 6,
   address optional). Role is forced to USER; reject any client-supplied role. Hash with
   bcrypt using config.bcryptSaltRounds. Duplicate email/phone -> 409 with a clear message.
   Returns { accessToken, refreshToken, user } exactly like login.
2. POST /api/v1/auth/login — keep the current behaviour; make sure a BLOCKED or INACTIVE
   user is rejected with 403.
3. POST /api/v1/auth/logout — auth-protected; clears the refresh token cookie if one is
   used and returns a success response (the client also clears local state).
4. GET /api/v1/auth/me — auth-protected; returns the fresh user row from the DB, never the
   password.
5. Password management:
   - POST /api/v1/auth/change-password (auth) — oldPassword + newPassword, verify then hash.
   - POST /api/v1/auth/forgot-password — accepts an email, generates a short-lived
     (15 min) reset JWT, and returns the reset link in the response for now with a clear
     TODO comment that an email service would deliver it in production. Never reveal
     whether the email exists (always answer with the same success message).
   - POST /api/v1/auth/reset-password — token + newPassword, verifies the reset token,
     hashes and stores the new password.
6. RBAC: confirm auth(...roles) is applied on every admin route added so far, and export a
   UserRole enum the frontend can also use.

Frontend:
7. src/redux/features/auth/authApi.ts — register, logout, changePassword, forgotPassword,
   resetPassword mutations.
8. Rewrite src/app/signup/page.tsx and src/app/login/page.tsx with react-hook-form + zod +
   FormInput: inline field errors, loading state, toast feedback, dispatch setUser, then
   redirect ADMIN/SUPER_ADMIN -> /dashboard/admin, USER -> /dashboard/user.
9. New pages src/app/forgot-password/page.tsx and src/app/reset-password/page.tsx
   (reads the token from the query string).
10. Navbar user menu: logout action that calls the mutation, dispatches logout(),
    resets the RTK Query cache (baseApi.util.resetApiState()), toasts, and redirects to /.
11. src/app/dashboard/(user)/change-password/page.tsx.

Keep the existing localStorage token strategy — do not switch to cookies mid-project.
```

**Checklist**
- [ ] Signup logs the user in and redirects to the correct dashboard
- [ ] Registering with `role: "ADMIN"` in the body still creates a USER
- [ ] Forgot password link resets the password and the new one works
- [ ] The old password stops working after a change
- [ ] Logout clears localStorage; protected pages redirect to `/login`
- [ ] A blocked user cannot log in

---

## Module 3 — User Accounts and Profile

Covers SRS §6.1 (manage personal profiles) and §6.2 (manage user accounts).

```
Task: Admin user management + user profile management.

Backend (server/src/modules/user):
1. GET /api/v1/users (ADMIN, SUPER_ADMIN) — filters: searchTerm (name/email/phone), role,
   status; pagination page/limit; sorting sortBy/sortOrder. Return meta { page, limit, total }
   through sendResponse. Use pick() for the query params.
2. GET /api/v1/users/:id — admin, or the owner of that id.
3. PATCH /api/v1/users/:id — owner may edit name, phone, address, avatar; admins may edit
   anyone; only SUPER_ADMIN may change role. Ignore any password field here (that is
   change-password's job).
4. PATCH /api/v1/users/:id/status (ADMIN, SUPER_ADMIN) — ACTIVE / INACTIVE / BLOCKED.
   An admin must not be able to block a SUPER_ADMIN or themselves.
5. DELETE /api/v1/users/:id (SUPER_ADMIN only).
6. Every user response must exclude password — do it with a shared Prisma select constant,
   not by deleting fields ad hoc.

Frontend:
7. src/redux/features/user/userApi.ts — add the status/role endpoints and pagination params.
8. src/app/dashboard/(admin)/all-users/page.tsx — real table with search, role + status
   filters, pagination, block/unblock, role change (SUPER_ADMIN only), delete with a
   confirm dialog, toasts and cache invalidation.
9. src/app/dashboard/(user)/user/page.tsx — profile view + edit form (name, phone, address,
   avatar through AvatarUploader), plus a link to change-password.
10. Wrap admin pages in ProtectedRoute allowedRoles={["ADMIN","SUPER_ADMIN"]}.
11. Add shared pagination/meta types to src/types/index.ts and a reusable
    src/components/shared/Pagination.tsx used by every list page from here on.
```

**Checklist**
- [ ] Search, role filter, status filter and pagination all work
- [ ] A blocked user can no longer log in
- [ ] A normal user editing someone else's profile gets 403
- [ ] No response contains a `password` field
- [ ] An admin cannot block themselves or a SUPER_ADMIN

---

## Module 4 — Destination Management

Covers the whole Destination Management block of SRS §8.

```
Task: Destination end-to-end — SRS section 8 requires listing, search, category filtering,
location-based filtering, details and an image gallery.

Backend (server/src/modules/destination):
1. GET /api/v1/destinations — searchTerm (title/location/description), category, district,
   minPrice, maxPrice, isFeatured, pagination, sorting (createdAt|rating|price).
   Return meta + data. Include _count of reviews and the average rating without N+1 queries.
2. GET /api/v1/destinations/:id — full record + images + reviews with their author
   (id, name, avatar). 404 through ApiError when missing.
3. POST / PATCH / DELETE — auth(ADMIN, SUPER_ADMIN) + validateRequest.
4. Deleting a destination must not orphan data: rely on the schema's cascade rules and
   state in the response how many related rows were affected.

Frontend:
5. src/redux/features/destination/destinationApi.ts + "Destination" tagType.
6. src/app/(commonLayout)/destinations/page.tsx — responsive grid, search bar, category +
   district + price filters, sort dropdown, pagination, skeleton loading, empty state.
   All filters live in the URL query string so a filtered view is shareable.
7. src/app/(commonLayout)/destinations/[id]/page.tsx — cover hero, image gallery using the
   existing carousel, description, location/district/category, price, rating summary,
   reviews area, and the action buttons (favorite / reserve / add to trip plan). If an
   action's module is not built yet, render the button disabled with a TODO comment.
8. src/components/ui/destination/DestinationCard.tsx — reused by the listing and by the
   home FeaturedDestinations section, which must now load real data (isFeatured, limit 6).
9. src/app/dashboard/(admin)/destinations/page.tsx — admin table + create/edit dialog with
   ImageUploader for coverImage and the gallery, and delete confirmation.

Read node_modules/next/dist/docs/01-app for the current dynamic route params, metadata and
data fetching conventions before writing the pages.
```

**Checklist**
- [ ] Search, category, district, price, sort and pagination all work and are reflected in the URL
- [ ] The detail page shows the gallery and reviews; an unknown id renders not-found
- [ ] Admin CRUD and image upload work; a non-admin gets 403
- [ ] The home Featured section loads from the database
- [ ] Mobile layout and dark mode are correct

---

## Module 5 — Hotel

```
Task: Complete the hotel module, mirroring the destination module exactly.

Backend (server/src/modules/hotel):
1. Full CRUD: GET / (list), GET /:id, POST, PATCH /:id, DELETE /:id — writes are
   auth(ADMIN, SUPER_ADMIN).
2. List query: searchTerm (name/location/description), location, minPrice/maxPrice on
   pricePerNight, amenities (comma separated, "has all"), minRating, pagination, sorting.
   Return meta + data with review count and average rating.
3. GET /:id includes reviews with their author.

Frontend:
4. src/redux/features/hotel/hotelApi.ts + "Hotel" tagType.
5. src/app/(commonLayout)/hotels/page.tsx — listing with location, price range, amenities
   and rating filters, pagination, skeletons, empty state, URL-driven filters.
6. src/app/(commonLayout)/hotels/[id]/page.tsx — gallery, amenity chips, price per night,
   contact phone, reviews area, and a "Request reservation" button.
7. src/components/ui/hotel/HotelCard.tsx; switch the home FeaturedHotels section to real data.
8. src/app/dashboard/(admin)/hotels/page.tsx — admin CRUD table + form with multi-image
   upload and amenities entered as tags.
9. Add "Hotels" to the Navbar if it is not there already.
```

**Checklist**
- [ ] `/api/v1/hotels/:id` supports GET, PATCH and DELETE
- [ ] Amenities and price-range filters return correct results
- [ ] Admin CRUD with multi-image upload works
- [ ] The home FeaturedHotels section loads real data

---

## Module 6 — Restaurant

New module: the Prisma model exists, the code does not.

```
Task: Build the restaurant module from scratch. The Prisma model Restaurant already exists
(name, location, cuisineType, description, priceRange, rating, coverImage, images, reviews,
reservations) — do not change the schema.

Backend: create server/src/modules/restaurant/ with interface, validation, services,
controller and route files following the destination module structure exactly:
1. GET /api/v1/restaurants — searchTerm (name/location/cuisineType), cuisineType, location,
   priceRange, minRating, pagination, sorting -> meta + data with review counts.
2. GET /api/v1/restaurants/:id — includes reviews with their author.
3. POST / PATCH /:id / DELETE /:id — auth(ADMIN, SUPER_ADMIN) + validateRequest.
4. Register the router at /restaurants in server/src/routes/index.ts.

Frontend:
5. src/redux/features/restaurant/restaurantApi.ts + "Restaurant" tagType.
6. src/app/(commonLayout)/restaurants/page.tsx — listing with cuisine type, location, price
   range and rating filters + pagination.
7. src/app/(commonLayout)/restaurants/[id]/page.tsx — gallery, cuisine, price range,
   location, reviews area, and a "Request reservation" button (SRS section 8 lists
   reservation requests for restaurants as well as hotels).
8. src/components/ui/restaurant/RestaurantCard.tsx.
9. src/app/dashboard/(admin)/restaurants/page.tsx — admin CRUD.
10. Add "Restaurants" to the Navbar.
```

**Checklist**
- [ ] `server/src/modules/restaurant/` contains all five files in the same pattern
- [ ] All CRUD endpoints work; a non-admin write returns 403
- [ ] Listing and detail pages render; the Navbar links to them

---

## Module 7 — Transportation

```
Task: Complete the transportation module. SRS section 8 requires bus, train, flight and car
rental information including route details, operator information, estimated cost and travel
duration.

Backend (server/src/modules/transportation):
1. Full CRUD, writes guarded by auth(ADMIN, SUPER_ADMIN).
2. List query: type (TransportType enum), routeFrom, routeTo (partial + case-insensitive),
   maxCost, searchTerm (operatorName), pagination, sorting (estimatedCost | duration |
   scheduleTime).
3. GET /api/v1/transportations/routes — distinct routeFrom and routeTo values, so the
   frontend can populate its From/To selects.

Frontend:
4. src/redux/features/transportation/transportationApi.ts + tagType.
5. src/app/(commonLayout)/transportation/page.tsx — a route-finder panel at the top
   (From select, To select, type), then results as cards/rows showing operator, schedule
   time, duration and estimated cost, with type tabs for BUS / TRAIN / FLIGHT / CAR_RENTAL
   and an empty state when no route matches.
6. Wire the home TransitRoutes section to real data.
7. src/app/dashboard/(admin)/transportation/page.tsx — admin CRUD with a TransportType select.
```

**Checklist**
- [ ] From/To search matches case-insensitively and partially
- [ ] All four type tabs filter correctly
- [ ] Admin CRUD works and the home TransitRoutes section uses real data

---

## Module 8 — Review and Rating

```
Task: Complete the review and rating system.

Backend (server/src/modules/review):
1. POST /api/v1/reviews (auth) — userId comes from req.user only. Body must carry exactly
   one of destinationId / hotelId / restaurantId; verify the target exists. rating is an
   integer 1..5. One review per user per target — a second attempt returns 409.
2. PATCH /api/v1/reviews/:id (auth) — only the review's author. DELETE /api/v1/reviews/:id —
   the author, or ADMIN/SUPER_ADMIN (SRS: administrators monitor and remove inappropriate
   reviews).
3. After every create/update/delete, recompute the parent entity's `rating` field (average
   of its reviews, rounded to 1 decimal) inside the same prisma $transaction.
4. GET /api/v1/reviews — filter by destinationId / hotelId / restaurantId / userId /
   minRating, pagination, newest first, author included (id, name, avatar).

Frontend:
5. src/redux/features/review/reviewApi.ts + "Review" tagType.
6. src/components/ui/StarRating.tsx — display and interactive modes, keyboard accessible.
7. src/components/shared/ReviewSection.tsx — takes { targetType, targetId }: rating summary
   with a distribution bar, review list with pagination, a submit form for logged-in users
   (guests see a "log in to review" prompt), and edit/delete controls on the current user's
   own review. Mount it on the destination, hotel and restaurant detail pages.
8. src/app/dashboard/(user)/my-reviews/page.tsx — the user's own reviews with edit/delete.
9. src/app/dashboard/(admin)/reviews/page.tsx — moderation table: all reviews with target
   info, rating filter, and delete.
10. Replace the hardcoded home Reviews section with the 6 most recent real reviews.
```

**Checklist**
- [ ] Submitting a review updates the target's average rating
- [ ] A user can edit and delete their own review but not anyone else's (403)
- [ ] A second review on the same target returns 409
- [ ] An admin can delete any review
- [ ] A forged `userId` in the body is ignored; the token's user is stored

---

## Module 9 — Favorites

```
Task: Finish the favorites feature.

Backend (server/src/modules/favorite):
1. GET /api/v1/favorites (auth) — the current user's favorites with the full destination
   included, paginated.
2. POST /api/v1/favorites (auth) — body { destinationId }; userId from req.user. Idempotent:
   handle the unique(userId, destinationId) conflict gracefully instead of erroring.
3. DELETE /api/v1/favorites/:destinationId (auth).
4. GET /api/v1/favorites/check/:destinationId (auth) -> { isFavorite: boolean }.

Frontend:
5. src/redux/features/favorite/favoriteApi.ts + "Favorite" tagType.
6. src/components/shared/FavoriteButton.tsx — heart toggle with optimistic update, invalidates
   the Favorite tag, and for a logged-out click shows a toast and routes to /login. Use it on
   DestinationCard and the destination detail page.
7. src/app/dashboard/(user)/favorites/page.tsx — real grid with remove action, empty state
   linking to /destinations.
```

**Checklist**
- [ ] The heart toggles instantly and survives a page refresh
- [ ] A logged-out click routes to `/login`
- [ ] The favorites page shows only the current user's data

---

## Module 10 — Trip Planner

```
Task: Build the full trip planner over the TripPlan and TripPlanItem models.

Backend (server/src/modules/tripPlan) — every route auth-protected and scoped to req.user;
a user must never read or modify another user's plan (404 rather than 403 to avoid leaking
existence):
1. GET /api/v1/trip-plans (own plans, paginated, items + destination summary included),
   GET /:id, POST, PATCH /:id, DELETE /:id.
2. Items: POST /api/v1/trip-plans/:id/items, PATCH /api/v1/trip-plans/:id/items/:itemId,
   DELETE /api/v1/trip-plans/:id/items/:itemId. Verify plan ownership before each.
3. Validation: endDate >= startDate; a visitDate must fall inside the plan's range; the same
   destination cannot be added twice to one plan.
4. Every plan response includes a computed estimatedCost (sum of the item destinations'
   prices) next to totalBudget.

Frontend:
5. src/redux/features/tripPlan/tripPlanApi.ts + "TripPlan" tagType.
6. src/app/dashboard/(user)/trip-plans/page.tsx — plan cards (title, date range, destination
   count, budget vs estimated), create dialog, delete confirmation, empty state.
7. src/app/dashboard/(user)/trip-plans/[id]/page.tsx — editable title/dates/budget/notes,
   an itinerary grouped by visitDate, an "Add destination" searchable picker dialog backed
   by the destinations API, per-item notes and visit date, remove item, and a budget summary
   that warns when the estimate exceeds the budget.
8. An "Add to trip plan" button on the destination detail page: a dialog to choose an
   existing plan or create a new one on the spot.
```

**Checklist**
- [ ] Creating, editing and deleting a plan works
- [ ] Destinations can be added and removed with notes and visit dates
- [ ] Another user's plan id returns 404
- [ ] `endDate` earlier than `startDate` is rejected
- [ ] The budget summary computes correctly

---

## Module 11 — Reservations

```
Task: Complete the reservation request flow. Note that Module 0 added restaurantId to the
Reservation model because SRS section 8 lists reservation requests under "Hotel and
Restaurant".

Backend (server/src/modules/reservation):
1. POST /api/v1/reservations (auth) — userId from req.user; exactly one of destinationId /
   hotelId / restaurantId; validate the date range and that the target exists.
   totalCost is computed on the SERVER (hotel pricePerNight x nights, or the destination
   price, or the restaurant's price range baseline) — never trust a client-sent totalCost.
   New reservations always start as PENDING.
2. GET /api/v1/reservations — a USER sees only their own; ADMIN/SUPER_ADMIN see all, with
   status, target-type, date-range and user filters plus pagination.
3. GET /api/v1/reservations/:id — owner or admin.
4. PATCH /api/v1/reservations/:id/status (ADMIN, SUPER_ADMIN) — enforce valid transitions:
   PENDING -> CONFIRMED | CANCELLED, CONFIRMED -> COMPLETED | CANCELLED; anything else 400.
5. PATCH /api/v1/reservations/:id/cancel (auth) — the owner may cancel only while PENDING.

Frontend:
6. src/redux/features/reservation/reservationApi.ts + "Reservation" tagType.
7. src/components/shared/ReservationDialog.tsx — target-aware (destination / hotel /
   restaurant), date range picker, live computed cost preview, submit with toast. Wire it to
   the "Request reservation" buttons on all three detail pages.
8. src/app/dashboard/(user)/reservations/page.tsx — the user's requests with status badges,
   target info, and cancel for PENDING ones.
9. src/app/dashboard/(admin)/reservations/page.tsx — all requests with status filter, target
   filter, and confirm / cancel / complete actions.
```

**Checklist**
- [ ] Reservations can be requested from hotels, destinations and restaurants
- [ ] A client-supplied `totalCost` is ignored
- [ ] A user sees only their own requests; an admin sees all
- [ ] A user cannot cancel a CONFIRMED reservation
- [ ] An invalid status transition returns 400

---

## Module 12 — Admin Dashboard, Statistics and Image Management

Covers the last two admin bullets of SRS §6.2.

```
Task: The two remaining admin bullets from SRS section 6.2 — "View system statistics" and
"Upload and manage images" — plus a proper dashboard shell.

Backend:
1. server/src/modules/stats — GET /api/v1/stats (ADMIN, SUPER_ADMIN), one response built
   with prisma.$transaction containing: user counts by role and status; totals for
   destinations, hotels, restaurants, transportations, reviews, trip plans; reservations
   grouped by status; total revenue from CONFIRMED + COMPLETED reservations; top 5 rated
   destinations; 5 most recent reservations and reviews; and a monthly reservation count
   for the last 6 months.
2. Image management in server/src/modules/upload:
   - DELETE /api/v1/upload/:publicId (ADMIN, SUPER_ADMIN) — removes the asset from
     Cloudinary.
   - POST /api/v1/upload/multiple — several images in one request (max 8).
   - When an admin removes an image from an entity's gallery, the controller should also
     delete it from Cloudinary. Store enough information to do that (parse the public_id
     out of the stored secure_url with a small helper, and unit-test that helper by hand).
3. Do not add any new Prisma model.

Frontend:
4. src/redux/features/stats/statsApi.ts.
5. Rewrite src/app/dashboard/(admin)/admin/page.tsx: KPI tiles, a reservations-per-month
   chart, a status breakdown, and recent activity lists. Build charts with plain SVG/CSS —
   do not add a charting library without asking. Include skeletons and an error state.
6. src/app/dashboard/layout.tsx — responsive dashboard shell with a role-aware sidebar
   (admin: overview, users, destinations, hotels, restaurants, transportation, reservations,
   reviews; user: profile, favorites, trip plans, reservations, my reviews, change password),
   a mobile drawer, breadcrumbs and the theme toggle.
7. src/components/shared/GalleryManager.tsx — used inside every admin create/edit form:
   shows current images, supports adding, reordering and deleting (delete also calls the
   Cloudinary delete endpoint), and enforces a single cover image.
```

**Checklist**
- [ ] `/api/v1/stats` returns everything in one request and 403s for non-admins
- [ ] The admin dashboard shows KPIs, a chart and recent activity
- [ ] Deleting a gallery image also removes it from Cloudinary
- [ ] The sidebar differs by role and the mobile drawer works

---

## Module 13 — Search, Filtering, Sorting and Recommendation

Covers the discovery objectives of SRS §5.

```
Task: The cross-cutting discovery features from SRS section 5 — "search, filtering, sorting,
and recommendation features".

Backend:
1. server/src/modules/search — GET /api/v1/search?q=&type=all|destination|hotel|restaurant
   &limit= (public). Returns grouped results { destinations, hotels, restaurants } with a
   compact payload each (id, title/name, coverImage, location, rating). Case-insensitive
   partial matching.
2. GET /api/v1/destinations/:id/recommendations — up to 6 other destinations in the same
   district or category, ordered by rating.

Frontend:
3. src/components/shared/SearchCommand.tsx — Navbar search with a 300ms debounce, grouped
   dropdown results, keyboard navigation, and a "See all results" link to /search.
4. src/app/(commonLayout)/search/page.tsx — full results page reading ?q= and ?type= from
   the URL, with type tabs and empty/loading states.
5. A "You may also like" carousel on the destination detail page.
6. Make the existing HeroSection search box navigate to /search?q=...
```

**Checklist**
- [ ] The Navbar search debounces and shows grouped results
- [ ] `/search?q=cox` returns all three result types
- [ ] The detail page shows related destinations, excluding itself

---

## Module 14 — Polish, Error Handling and Responsiveness

Covers SRS §10 Phase 4.

```
Task: Production polish. No new features.

Frontend:
1. Add loading.tsx and error.tsx for the commonLayout and dashboard route groups, plus
   per-page skeletons wherever data is fetched. Check the current conventions in
   node_modules/next/dist/docs/01-app first.
2. generateMetadata on every public page (home, destinations + detail, hotels + detail,
   restaurants + detail, transportation, search, about) — title, description, and openGraph
   with the cover image on detail pages.
3. Every list page must handle three states cleanly: loading skeleton, empty state with a
   call to action, error state with retry.
4. Replace every <img> with next/image and configure the Cloudinary remote pattern in
   next.config.ts.
5. Global 401 handling: wrap baseQuery in src/redux/api/baseApi.ts so a 401 dispatches
   logout, clears the cache and redirects to /login. Attempt one silent refresh-token call
   before giving up.
6. Accessibility and responsiveness sweep: visible focus rings, alt text on all images,
   aria-labels on icon-only buttons, no horizontal scroll at 360px, correct contrast in both
   light and dark mode.
7. Improve src/app/not-found.tsx and add a root error boundary.
8. Dead code and scaffolding cleanup before submission:
   - delete src/app/demo/page.tsx (a scratch page that is not part of the SRS)
   - delete the unused Next.js starter assets in public/ (next.svg, vercel.svg, file.svg,
     window.svg) and any image no page references
   - src/components/ui/index.ts re-exports the same components as
     src/components/shared/index.ts, giving two import paths for one component. Keep the
     shared barrel as the single source, fix the imports that use the ui one, and remove the
     duplicate re-exports.
   - remove every leftover console.log, commented-out block and TODO that is not tracked in
     the docs, and delete any component left unused after the earlier modules replaced it.

Backend:
9. Add express rate limiting on the auth routes (ask before installing express-rate-limit),
   helmet-style basic hardening if approved, and confirm globalErrorHandler never leaks a
   stack trace when NODE_ENV=production.
10. Add a request logger (morgan or a small custom middleware) and make sure every unhandled
    promise rejection is caught.

Run `npm run build` in both packages and fix every error and warning.
```

**Checklist**
- [ ] `npm run build` is clean in both packages
- [ ] No horizontal scroll at 360px width
- [ ] An expired token triggers a silent refresh, then auto-logout
- [ ] Production error responses contain no stack traces
- [ ] No dead code, demo page or unused assets remain

---

## Module 15 — Deliverables

Covers SRS §12.

```
Task: Produce the remaining SRS section 12 deliverables. Read travel_srs.md first and make
every document consistent with it.

1. docs/ER-DIAGRAM.md — an entity relationship diagram of the Prisma schema as a mermaid
   erDiagram block, generated by reading server/prisma/schema.prisma (all 11 models, every
   field with its type, and every relationship with correct cardinality). Below the diagram,
   add a table per entity describing each attribute and its purpose. Also add a note
   explaining how to render it to an image.
2. docs/API.md — every endpoint documented from the actual route files (not from memory):
   method, path, auth requirement and allowed roles, query params, request body schema,
   sample success response and sample error response. Group by module and state the base
   URL /api/v1.
3. docs/TESTING.md — the testing report required by SRS section 10 Phase 4, with four
   sections: functional testing, API testing, security testing, responsive testing. Each is
   a table of test case ID, description, steps, expected result, actual result, status.
   Cover every module, every role boundary, and the mobile/tablet/desktop breakpoints.
   Leave the actual-result column for the developer to fill after running the cases.
4. docs/DEPLOYMENT.md + config — frontend on Vercel, backend on Render or Railway,
   PostgreSQL managed. Document every env var for both, the build/start commands, the
   prisma generate + migrate deploy step, and the CORS origin setting. Add the needed
   config files (for example server/render.yaml or a Dockerfile if that is simpler) but do
   not deploy anything yourself.
5. Rewrite README.md: project title from the SRS, overview, architecture diagram of the
   three layers, tech stack table matching SRS section 9 exactly, folder structure,
   local setup for both packages, seeded demo credentials, scripts, and links to the docs.
   Add a clearly separated "Supporting libraries" subsection listing every package used
   that is NOT named in SRS section 9 (Cloudinary, shadcn/Radix, react-hook-form, zod,
   framer-motion, embla-carousel, next-themes, react-hot-toast, multer, cors, http-status,
   and anything else installed), each with one line stating which SRS requirement it serves
   and which listed technology it complements. State explicitly that none of them replaces
   a technology named in SRS section 9 — the required stack is used in full.
6. docs/SRS-TRACEABILITY.md — a table mapping every functional requirement in SRS section 8
   and every feature in section 6 to the files that implement it (route file + page file).
7. Final security pass: verify no endpoint trusts a client-supplied userId or role, no
   password is ever returned, every admin route calls auth() with roles, and no secret is
   committed. Fix one-line issues and list the rest in docs/SECURITY-NOTES.md.
```

**Checklist**
- [ ] The ER diagram covers all 11 models with correct relationships
- [ ] `docs/API.md` matches the actual route files exactly
- [ ] `docs/SRS-TRACEABILITY.md` maps every SRS requirement to real files
- [ ] A new developer can run the project from the README alone
- [ ] Deployed and verified on Vercel + Render (manual step)

---

## Rules

1. One module per prompt, per review, per commit. Never run two modules together.
2. After every module: `cd server && npx tsc --noEmit`, then `npx tsc --noEmit` at the root, then `npm run lint`, then run both dev servers and test manually, then commit. Commit format: `feat(hotel): complete hotel module CRUD + admin UI`.
3. The SRS is final. If a task conflicts with it, stop and ask.
4. The Prisma schema is frozen after Module 0. Every SRS feature fits the existing models.
5. `userId` and `role` always come from the JWT, never from a request body or query string.
6. The frontend never touches the database. All data goes through RTK Query to the Express API (SRS §7 layer separation).
7. Ask before installing any new npm package. The SRS §9 stack cannot be swapped out.
8. When unsure about a Next.js API, read `node_modules/next/dist/docs/01-app/` — never write it from memory.

### Dependency order

```
0 Express skeleton + schema
 └─ 1 Migrate existing modules to Express
     └─ 2 Auth
         └─ 3 User & Profile
             └─ 4 Destination ──┬─ 5 Hotel
                                ├─ 6 Restaurant
                                └─ 7 Transportation
                                     └─ 8 Review ─ 9 Favorites ─ 10 Trip Planner ─ 11 Reservation
                                          └─ 12 Admin/Stats/Images ─ 13 Search ─ 14 Polish ─ 15 Deliverables
```

Modules 5, 6 and 7 are independent of each other and can run in any order or in parallel. Modules 8–11 require 4–7. Modules 0 and 1 must come first, with no exceptions.
