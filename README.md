# Travla BD - Travel Guide Web Application

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

## 📁 Repository Structure

```
travla/
├── prisma/                 # Prisma DB schema & migration files
├── public/                 # Static assets & images
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── (commonLayout)/ # Main public layout (Home, About, etc.)
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── demo/           # Tour packages component showcase
│   │   └── not-found.tsx   # Custom 404 page
│   ├── components/         # Reusable React components
│   │   ├── providers/      # Redux & theme context providers
│   │   ├── shared/         # Shared UI (Navbar, Footer, Container, Form controls)
│   │   └── ui/             # Core UI components (Buttons, Cards, Sliders)
│   ├── redux/              # Redux slices, hooks & store configuration
│   └── types/              # TypeScript interfaces & types
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
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

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory using `.env.example` as a reference:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL database credentials and JWT secret keys:
   ```env
   DATABASE_URL="postgres://username:password@localhost:5432/travla_db"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="7d"
   JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
   JWT_REFRESH_EXPIRES_IN="30d"
   BCRYPT_SALT_ROUNDS="12"
   ```

4. **Initialize Database with Prisma**:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

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
