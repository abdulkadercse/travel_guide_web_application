"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  FaGraduationCap,
  FaCalendarDays,
  FaBuildingColumns,
  FaIdBadge,
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaCircleCheck,
} from "react-icons/fa6";

const academicInfo = {
  course: "Software Development III",
  courseCode: "CSE 3292",
  department: "Department of Computer Science & Engineering (CSE)",
  faculty: "Faculty of Science & Engineering",
  institution: "Northern University Bangladesh",
  semester: "8B",
  submissionDate: "30 July 2026",
  projectTitle: "Travla BD — Comprehensive Travel Guide Web Application",
};

interface TeamMember {
  name: string;
  id: string;
  role: string;
  image?: string | null;
  initials: string;
  color: string;
  skills: string[];
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Tanvir Ahmed",
    id: "41420101277",
    role: "Full Stack Engineer & Team Lead",
    image: "/teams/174376225.jpeg",
    initials: "TA",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-300",
    skills: ["Next.js 16", "React 19", "Express.js", "TypeScript", "Prisma"],
    bio: "Led end-to-end architecture, user interface layer development, state management with RTK Query, and core service integration.",
  },
  {
    name: "Md. Mamun Islam",
    id: "41420101282",
    role: "Backend & System Architect",
    image: null,
    initials: "MI",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-300",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT Security", "Bcrypt"],
    bio: "Architected application server layer, secure authentication flows, role-based authorization, and REST endpoint controllers.",
  },
  {
    name: "Md. Abdul Kader",
    id: "41420101284",
    role: "Frontend & UI/UX Engineer",
    image: null,
    initials: "AK",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-300",
    skills: ["Tailwind CSS v4", "Component Design", "Responsive Layouts", "Dark Mode"],
    bio: "Crafted accessible, responsive user interfaces, design tokens, reusable UI primitives, and modern interactive modules.",
  },
  {
    name: "Md. Nahid Hasan",
    id: "41420101285",
    role: "Database & Quality Assurance Engineer",
    image: null,
    initials: "NH",
    color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300",
    skills: ["PostgreSQL", "Prisma ORM", "Schema Design", "Integration Testing"],
    bio: "Managed PostgreSQL relational models, Prisma migrations, seed datasets, query performance, and end-to-end test verification.",
  },
];

const architectureLayers = [
  {
    layer: "Layer 1: User Interface",
    Icon: FaLaptopCode,
    tech: "Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Redux Toolkit · RTK Query",
    description:
      "Fully responsive, client-side caching with RTK Query, accessible UI components, theme switching, and seamless user experiences across devices.",
  },
  {
    layer: "Layer 2: Application Server",
    Icon: FaServer,
    tech: "Node.js · Express.js · REST API · JWT Auth · Bcrypt · Zod Validation",
    description:
      "Decoupled REST API in server/, enforcing role-based access control (USER, ADMIN, SUPER_ADMIN), centralized error handling, and robust business logic.",
  },
  {
    layer: "Layer 3: Database & ORM",
    Icon: FaDatabase,
    tech: "PostgreSQL · Prisma ORM · Relational Schema · Automated Migrations",
    description:
      "11 relational models with cascade integrity, idempotent seed datasets, optimized relations for destinations, stays, transit, reviews, and reservations.",
  },
];

export function TeamContainer() {
  return (
    <>
      {/* Hero Section with Full Background Image */}
      <section className="relative h-[480px] min-h-[450px] flex items-center overflow-hidden border-b border-border">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/team-hero.jpg"
            alt="Engineering team collaboration for Travla BD"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Clean uniform dark overlay */}
          <div className="absolute inset-0 bg-slate-950/75" />
        </div>

        <Container>
          <div className="mx-auto max-w-4xl flex flex-col items-center text-center space-y-4">
            {/* Glass Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-950/60 px-4 py-1.5 text-xs font-semibold text-teal-300 backdrop-blur-md shadow-sm">
              <FaGraduationCap className="h-3.5 w-3.5 text-teal-400" />
              <span>{academicInfo.courseCode} Capstone Project</span>
              <span className="h-1 w-1 rounded-full bg-teal-400" />
              <span className="text-teal-200/80">Department of CSE</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance drop-shadow-sm">
              Meet the Development Team
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base leading-relaxed text-slate-200 max-w-2xl mx-auto text-pretty drop-shadow-xs">
              The engineers behind <strong>Travla BD</strong> — developed for the{" "}
              <strong>{academicInfo.course}</strong> course under the{" "}
              <strong>{academicInfo.department}</strong> at{" "}
              <strong>{academicInfo.institution}</strong>.
            </p>

            {/* Glass Academic Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md shadow-md transition-all hover:bg-white/15">
                <FaBuildingColumns className="h-3.5 w-3.5 text-teal-300" />
                <span>{academicInfo.institution}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md shadow-md transition-all hover:bg-white/15">
                <FaGraduationCap className="h-3.5 w-3.5 text-teal-300" />
                <span>Semester: <strong>{academicInfo.semester}</strong></span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md shadow-md transition-all hover:bg-white/15">
                <FaCalendarDays className="h-3.5 w-3.5 text-teal-300" />
                <span>Submission: <strong>{academicInfo.submissionDate}</strong></span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Team Profiles Grid */}
      <section className="py-12 sm:py-16">
        <Container className="space-y-8">
          <div className="max-w-2xl space-y-1.5">
            <p className="eyebrow">Engineering Roster</p>
            <h2 className="heading">Core Contributors & Roles</h2>
            <p className="text-sm text-muted-foreground">
              Each member spearheaded specialized modules across the 3-layer architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-teal-400 opacity-85" />

                <div>
                  {/* Avatar / Photo */}
                  <div className="relative mb-4 flex items-center justify-center">
                    {member.image ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border-3 border-primary/30 p-1 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-primary">
                        <div className="relative h-full w-full overflow-hidden rounded-full">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border-3 border-border bg-gradient-to-br ${member.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                      >
                        <span className="text-xl font-bold tracking-tight">
                          {member.initials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary">
                      {member.role}
                    </p>

                    <div className="my-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-secondary/60 py-1 px-2.5">
                      <FaIdBadge className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {member.id}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-1 text-pretty">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Skills Chips & Footer */}
                <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-center text-muted-foreground pt-1">
                    Northern University Bangladesh
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Architecture & Engineering Overview */}
      <section className="py-12 sm:py-16 border-y border-border bg-secondary/30">
        <Container className="space-y-8">
          <div className="max-w-2xl space-y-1.5">
            <p className="eyebrow">Project Architecture</p>
            <h2 className="heading">Built on a 3-Layer System Design</h2>
            <p className="text-sm text-muted-foreground">
              Strict separation of concerns according to the project specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {architectureLayers.map((layer) => (
              <div
                key={layer.layer}
                className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <layer.Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {layer.layer}
                    </h3>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/60 p-2.5">
                  <p className="text-xs font-mono font-medium text-primary">
                    {layer.tech}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Official Academic Record & Table */}
      <section className="py-12 sm:py-16">
        <Container className="space-y-6">
          <div className="max-w-2xl space-y-1.5">
            <p className="eyebrow">Academic Submission Record</p>
            <h2 className="heading">Student ID & Roster Verification</h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="border-b border-border bg-secondary/40 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  CSE 3292 Capstone Project Submission Record
                </h3>
                <p className="text-xs text-muted-foreground">
                  Semester 8B · Submission Date: 30 July 2026
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <FaCircleCheck className="h-3.5 w-3.5" />
                <span>Verified Roster</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-xs font-semibold text-muted-foreground uppercase">
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Student ID</th>
                    <th className="px-5 py-3">Primary Role</th>
                    <th className="px-5 py-3">Department & University</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {teamMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground flex items-center gap-3">
                        {member.image ? (
                          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/40">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-bold">
                            {member.initials}
                          </div>
                        )}
                        <span>{member.name}</span>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-medium text-foreground">
                        {member.id}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-medium text-primary">
                        {member.role}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        Department of CSE, Northern University Bangladesh
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16 border-t border-border bg-secondary/20">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight">
                Explore Travla BD Destinations
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover curated destinations, verified hotels, dining spots and seamless transport.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/about">About Project</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/#destinations">Browse destinations</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default TeamContainer;
