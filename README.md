# Travla BD - Travel Guide Web Application

🔗 **Live Project Link**: 
https://travel-guide-web-application.vercel.app


> **A Full-Stack Platform for Smart Travel Planning and Destination Management**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

---

## 📌 Project Overview

**Travla BD** is a comprehensive, full-stack web application designed to solve the challenges travelers face when discovering destinations, finding accommodations, exploring transportation options, and organizing travel schedules across Bangladesh.

By centralizing information about tourist destinations (such as Cox's Bazar, Somapura Mahavihara at Paharpur, Nilgiri Bandarban, and Sylhet Tea Gardens), hotels, restaurants, transportation services, and personalized trip itineraries, Travla provides an intuitive, all-in-one smart travel management ecosystem.

---

## 🎯 Key Objectives

1. **Centralized Travel Discovery**: Interactive platform for exploring tourist spots, accommodations, dining, and transit options.
2. **Personalized Trip Planner**: Tools for creating custom travel schedules, adding multiple destinations, setting budgets, and taking trip notes.
3. **Role-Based Access Control**: Secure authentication and authorization separating regular travelers and system administrators.
4. **Community Ratings & Reviews**: Transparent review and rating system for destinations and services.
5. **Administrative Management Panel**: Dashboard for managing users, destinations, hotels, transportation, and reservation requests.

---

## 🚀 Features

### 👤 User Features
- **Secure Authentication**: Registration, Login/Logout, JWT token management, and protected routes.
- **Destination Discovery**: Browse tourist destinations with rich photo galleries, location details, category tags, and keyword search.
- **Hotels & Restaurants**: Explore top-rated stay places and dining options with location info and reviews.
- **Transportation Directory**: Access route details, schedules, operator info, and estimated costs for buses, trains, flights, and car rentals.
- **Interactive Trip Planner**: Build custom travel itineraries, manage schedules, set budget estimates, and attach personal notes.
- **Favorites & Bookmarks**: Save favorite destinations for quick access.
- **Ratings & Reviews**: Share ratings and reviews on travel spots and services.
- **Reservation Requests**: Submit reservation inquiries for hotels and tour activities.

### 🛡️ Administrator Features
- **Dashboard Analytics**: Overview of users, destinations, reservations, and platform activity.
- **User Management**: View, update, or manage user roles and account statuses.
- **Content Management**: Create, update, and manage tourist destinations, hotels, restaurants, and transportation records.
- **Review Moderation**: Monitor and manage user-submitted ratings and reviews.
- **Reservation Handling**: Review and update status for incoming booking and reservation requests.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router) | React SSR/SSG Web Application Framework |
| **UI Library & Styling** | React 19, Tailwind CSS v4, Framer Motion | Responsive layout, dark/light themes, animations |
| **State Management** | Redux Toolkit, React-Redux | Global authentication & application state |
| **Icons & Notifications** | Lucide React, React Icons, React Hot Toast | Modern icons & toast notifications |
| **Backend & API** | Node.js, Express.js / Next.js API Routes | RESTful API endpoints & business logic |
| **Database & ORM** | PostgreSQL, Prisma ORM | Relational database storage & type-safe queries |
| **Authentication & Security** | JWT (JSON Web Tokens), Bcryptjs | Password hashing & token-based session security |

---

## 🏗️ System Architecture

Travla BD follows a decoupled **Three-Tier Software Architecture**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      User Interface Layer                   │
 │       Next.js App Router + React 19 + Tailwind CSS          │
 └──────────────────────────────┬──────────────────────────────┘
                                │ REST API / Actions
 ┌──────────────────────────────▼──────────────────────────────┐
 │                  Application Server Layer                   │
 │      Node.js Server + Express / API Routes + JWT Auth        │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Prisma ORM
 ┌──────────────────────────────▼──────────────────────────────┐
 │                      Database Layer                         │
 │                   PostgreSQL Relational DB                  │
 └─────────────────────────────────────────────────────────────┘
```

---

## 📌 Development Guidelines & Best Practices

To ensure codebase consistency, maintainability, and clear understanding for all developers:

1. **Mandatory Redux Usage for Dashboard**:
   - All state management, authentication flows, data fetching, mutations, and caching across the **Dashboard** (`/dashboard`, `/dashboard/admin`, `/dashboard/user`) **MUST use Redux Toolkit and RTK Query** (`src/redux/api/baseApi.ts` and feature slices/endpoints).
   - Bypassing Redux or doing raw `fetch` calls inside Dashboard components is strictly prohibited.

2. **Folder Structure Maintenance**:
   - The established folder structure (`src/app/`, `src/components/`, `src/redux/`, `src/server/`, `prisma/`) **MUST be strictly maintained**.
   - All new feature components, services, and API endpoints must adhere strictly to their respective folders so any developer reading the code can easily navigate and understand the application architecture.

---

## 📁 Repository Structure

The repository holds two packages: the Next.js frontend at the root and the Express API in `server/`.

```
travla/
├── server/                     # Application Server Layer (Node.js + Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma       # Database Layer schema (PostgreSQL + Prisma)
│   │   └── seed.ts             # Demo data seeder
│   ├── src/
│   │   ├── app.ts              # Express app, CORS, /api/v1 mount, error handlers
│   │   ├── server.ts           # Bootstrap, DB connect, graceful shutdown
│   │   ├── config/             # Typed environment loader
│   │   ├── routes/             # Root router, one entry per feature module
│   │   ├── middlewares/        # auth, validateRequest, globalErrorHandler, notFound
│   │   ├── shared/             # prisma client, ApiError, catchAsync, sendResponse, pick
│   │   ├── utils/              # jwtHelpers, cloudinary
│   │   └── modules/            # Feature modules (interface/validation/services/controller/route)
│   └── .env.example            # Backend environment template
├── public/                     # Static assets & images
├── src/                        # User Interface Layer (Next.js frontend only)
│   ├── app/                    # App Router pages & layouts
│   │   ├── (commonLayout)/     # Public layout (Home, About, etc.)
│   │   ├── dashboard/          # Role-based dashboards, (admin) and (user) groups
│   │   ├── login/  signup/     # Auth pages
│   │   └── not-found.tsx       # Custom 404 page
│   ├── components/
│   │   ├── providers/          # Redux & theme context providers
│   │   ├── shared/             # Navbar, Footer, Container, form controls, uploaders
│   │   └── ui/                 # shadcn primitives & section components
│   ├── redux/                  # Store, RTK Query baseApi, feature APIs & slices
│   ├── lib/  utils/  types/    # Frontend helpers and shared types
├── .env.example                # Frontend environment template
└── README.md                   # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed:
- **Node.js**: `v20.0.0` or higher
- **npm**: `v10.0.0` or higher
- **PostgreSQL**: Running instance (Local or Cloud like Neon, Supabase, Prisma Postgres)

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/abdulkadercse/travel_guide_web_application.git
   cd travel_guide_web_application
   ```

2. **Install Dependencies** (both packages):
   ```bash
   npm install            # frontend, from the repo root
   cd server && npm install && cd ..
   ```

3. **Configure Environment Variables**:

   Backend secrets — database, JWT, Cloudinary — live in `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```

   Frontend keys live in `.env.local` at the repo root:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   ```

   The frontend never receives a database URL or a secret key — only the Express server does.

### Database setup

All database commands are run **from the `server/` directory**, because the schema belongs to the Application Server Layer.

```bash
cd server
npx prisma migrate dev --name init   # create the database schema
npx prisma generate                  # regenerate the typed Prisma client
npm run seed                         # load demo users, destinations, hotels, restaurants, transport
```

`npm run seed` prints the demo account credentials when it finishes.

### Running the project

The frontend and the API are two separate processes — open two terminals.

```bash
# Terminal 1 — Application Server Layer
cd server
npm run dev            # http://localhost:5001  (API base: /api/v1)

# Terminal 2 — User Interface Layer
npm run dev            # http://localhost:3000
```

Check that the API is alive at [http://localhost:5001/health](http://localhost:5001/health), then open [http://localhost:3000](http://localhost:3000).

---

## 🎓 Academic Information & Project Team

This project is submitted for the course **Software Development III (Course Code: CSE 3292)** under the **Department of Computer Science & Engineering (CSE)** at **Northern University Bangladesh**.

- **Semester**: 8B
- **Submission Date**: 30 July 2026

### 👨‍💻 Development Team

| Student Name | Student ID |
| :--- | :--- |
| **Tanvir Ahmed** | 41420101277 |
| **Md. Mamun Islam** | 41420101282 |
| **Md. Abdul Kader** | 41420101284 |
| **Md. Nahid Hasan** | 41420101285 |

---

## 📄 License

This project is developed for educational and software engineering demonstration purposes.
