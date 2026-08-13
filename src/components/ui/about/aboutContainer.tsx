"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  FaLocationDot,
  FaRoute,
  FaCircleCheck,
  FaUsers,
  FaGraduationCap,
  FaCalendarDays,
  FaBuildingColumns,
  FaIdBadge,
  FaCode,
  FaCompass,
} from "react-icons/fa6";

const values = [
  {
    Icon: FaLocationDot,
    title: "One source, not six tabs",
    body: "Destinations, stays, restaurants and transport live together, so comparing options does not mean losing your place.",
  },
  {
    Icon: FaRoute,
    title: "Planning that survives the trip",
    body: "An itinerary you can edit day by day, with notes and a budget that updates as the plan changes.",
  },
  {
    Icon: FaCircleCheck,
    title: "Listings we stand behind",
    body: "Nothing appears on the site until an administrator has checked it, and reviews come only from registered travellers.",
  },
  {
    Icon: FaUsers,
    title: "Built for the people going",
    body: "Made for students, families and solo travellers crossing Bangladesh on a real budget.",
  },
];

const stack = [
  {
    label: "Interface",
    value: "Next.js 16 · React 19 · TypeScript · Tailwind CSS v4",
  },
  { label: "State & data", value: "Redux Toolkit · RTK Query" },
  { label: "Server", value: "Node.js · Express.js · REST API · JWT · Bcrypt" },
  { label: "Database", value: "PostgreSQL · Prisma ORM" },
];

const academicInfo = {
  course: "Software Development III",
  courseCode: "CSE 3292",
  department: "Department of Computer Science & Engineering (CSE)",
  institution: "Northern University Bangladesh",
  semester: "8B",
  submissionDate: "30 July 2026",
};

interface TeamMember {
  name: string;
  id: string;
  role: string;
  image?: string | null;
  initials: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Tanvir Ahmed",
    id: "41420101277",
    role: "Full Stack Developer",
    image: "/teams/174376225.jpeg",
    initials: "TA",
    color:
      "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-300",
  },
  {
    name: "Md. Mamun Islam",
    id: "41420101282",
    role: "Backend & System Architect",
    image: null,
    initials: "MI",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-300",
  },
  {
    name: "Md. Abdul Kader",
    id: "41420101284",
    role: "Frontend & UI/UX Engineer",
    image: null,
    initials: "AK",
    color:
      "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-300",
  },
  {
    name: "Md. Nahid Hasan",
    id: "41420101285",
    role: "Database & QA Engineer",
    image: null,
    initials: "NH",
    color:
      "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-300",
  },
];

export function AboutContainer() {
  return (
    <>
      {/* Hero Section with Full Background Image (500px Height) */}
      <section className="relative h-[460px] min-h-[450px] flex items-center overflow-hidden">
        {/* Background Image with Dark/Teal Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/bg-travel.jpg"
            alt="Travelling across Bangladesh with Travla BD"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Clean uniform dark overlay without bottom shadow/fade */}
          <div className="absolute inset-0 bg-slate-950/65" />
        </div>

        <Container>
          <div className="mx-auto max-w-5xl flex flex-col items-center text-center space-y-4">
            {/* Main Heading */}
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.15] text-balance drop-shadow-sm">
              Travel information worth trusting, in one place.
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="mx-auto text-sm leading-relaxed text-slate-200 sm:text-base text-pretty max-w-4xl drop-shadow-xs">
              Planning a trip in Bangladesh usually means a dozen tabs, three
              phone calls and a screenshot folder. Travla brings destinations,
              hotels, restaurants, transport and your own itinerary into a
              single platform — and keeps it organised from the first search to
              the confirmed reservation.
            </p>

            {/* Glass Metrics Cards */}
            <div className="mx-auto grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 w-full max-w-2xl text-center">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur-md shadow-md transition-all duration-300 hover:border-teal-400/50 hover:bg-white/15 hover:-translate-y-0.5">
                <p className="text-xl font-bold tracking-tight text-teal-300">
                  64
                </p>
                <p className="text-xs font-medium text-slate-200">
                  Districts of Bangladesh
                </p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur-md shadow-md transition-all duration-300 hover:border-teal-400/50 hover:bg-white/15 hover:-translate-y-0.5">
                <p className="text-xl font-bold tracking-tight text-teal-300">
                  100%
                </p>
                <p className="text-xs font-medium text-slate-200">
                  Verified Listings
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur-md shadow-md transition-all duration-300 hover:border-teal-400/50 hover:bg-white/15 hover:-translate-y-0.5">
                <p className="text-xl font-bold tracking-tight text-teal-300">
                  All-in-One
                </p>
                <p className="text-xs font-medium text-slate-200">
                  Smart Trip Planner
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Academic Information & Development Team Section */}
      <section className="py-12 sm:py-16 border-y border-border bg-secondary/30">
        <Container className="space-y-8 sm:space-y-10">
          {/* Section Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <FaGraduationCap className="h-4 w-4" />
                <span>Academic Project</span>
              </div>
              <h2 className="heading">Meet the Development Team</h2>
              <p className="text-base text-muted-foreground">
                Developed for the Software Development III capstone course under
                the Department of Computer Science & Engineering at Northern
                University Bangladesh.
              </p>
            </div>

            {/* Academic Badges */}
            <div className="flex flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-xs">
                <FaBuildingColumns className="h-3.5 w-3.5 text-primary" />
                <span>{academicInfo.institution}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-xs">
                <FaGraduationCap className="h-3.5 w-3.5 text-primary" />
                <span>
                  Semester: <strong>{academicInfo.semester}</strong>
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-xs">
                <FaCalendarDays className="h-3.5 w-3.5 text-primary" />
                <span>
                  Submission: <strong>{academicInfo.submissionDate}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Academic Info Banner */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Course
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {academicInfo.course}
                </p>
                <p className="text-xs text-primary font-mono font-medium">
                  Code: {academicInfo.courseCode}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Department
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Computer Science & Engineering
                </p>
                <p className="text-xs text-muted-foreground">
                  Faculty of Science & Engineering
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Semester & Batch
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Semester {academicInfo.semester}
                </p>
                <p className="text-xs text-muted-foreground">
                  B.Sc. in CSE Program
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Submission Date
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {academicInfo.submissionDate}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Final Project Submission
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FaCode className="h-4 w-4 text-primary" />
                <span>Development Team Members</span>
              </h3>
              <span className="text-xs text-muted-foreground">
                4 Active Contributors
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  {/* Top accent glow */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-teal-400 opacity-80" />

                  {/* Profile Picture / Avatar */}
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

                  {/* Info */}
                  <div className="flex flex-1 flex-col text-center">
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </h4>
                    <p className="mt-0.5 text-xs font-medium text-primary">
                      {member.role}
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-secondary/60 py-1.5 px-3">
                      <FaIdBadge className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-mono font-semibold text-foreground">
                        {member.id}
                      </span>
                    </div>

                    <div className="mt-3 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                      Northern University Bangladesh
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Structured Table for Academic Record */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="border-b border-border bg-secondary/40 px-5 py-3.5">
              <h4 className="text-sm font-semibold text-foreground">
                Team Roster & ID Verification Table
              </h4>
              <p className="text-xs text-muted-foreground">
                Official project submission record for CSE 3292
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-xs font-semibold text-muted-foreground uppercase">
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Student ID</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Institution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {teamMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-semibold text-foreground flex items-center gap-3">
                        {member.image ? (
                          <div className="relative h-7 w-7 overflow-hidden rounded-full border border-primary/40">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="28px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary text-xs font-bold">
                            {member.initials}
                          </div>
                        )}
                        <span>{member.name}</span>
                      </td>
                      <td className="px-5 py-3 font-mono font-medium text-foreground">
                        {member.id}
                      </td>
                      <td className="px-5 py-3 text-xs font-medium text-primary">
                        {member.role}
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        Northern University Bangladesh
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16">
        <Container className="space-y-8 sm:space-y-10">
          <div className="max-w-xl space-y-2">
            <p className="eyebrow">What we care about</p>
            <h2 className="heading">Four things we refuse to compromise on</h2>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {values.map(({ Icon, title, body }) => (
              <div key={title} className="space-y-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-base">{title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stack */}
      <section className="py-12 sm:py-16 border-y border-border bg-secondary/40">
        <Container className="space-y-8">
          <div className="max-w-xl space-y-2">
            <p className="eyebrow">How it is built</p>
            <h2 className="heading">A three-layer architecture</h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The interface, the application server and the database are
              separate layers. The browser never reaches the database directly —
              every request passes through the REST API, where authentication
              and authorisation are enforced.
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {stack.map((row) => (
              <div key={row.label} className="bg-card p-5 sm:p-6">
                <dt className="text-sm text-muted-foreground">{row.label}</dt>
                <dd className="mt-1 text-sm font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg space-y-2">
              <h2 className="text-2xl sm:text-3xl">
                Start planning your next trip
              </h2>
              <p className="text-base text-muted-foreground">
                Create a free account to save places and build an itinerary.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/signup">Create an account</Link>
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

export default AboutContainer;
