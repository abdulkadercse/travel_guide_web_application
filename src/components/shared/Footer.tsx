"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import {
  FaCompass,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const destinationLinks = [
  { label: "Cox's Bazar Beach", href: "/#destinations" },
  { label: "Paharpur, Naogaon", href: "/#destinations" },
  { label: "Nilgiri, Bandarban", href: "/#destinations" },
  { label: "Sylhet Tea Gardens", href: "/#destinations" },
  { label: "Sundarbans Forest", href: "/#destinations" },
];

const planLinks = [
  { label: "Find a stay", href: "/#stays" },
  { label: "Getting around", href: "/#transport" },
  { label: "Trip planner", href: "/dashboard/user" },
  { label: "Saved places", href: "/dashboard/favorites" },
];

const companyLinks = [
  { label: "About us", href: "/about" },
  { label: "Traveller reviews", href: "/#reviews" },
  { label: "Common questions", href: "/#faq" },
  { label: "Create an account", href: "/signup" },
];

const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { label: "X", href: "https://x.com", Icon: FaXTwitter },
  { label: "YouTube", href: "https://youtube.com", Icon: FaYoutube },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary/40">
      <Container className="py-14 lg:py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-5 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FaCompass className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Travla<span className="text-primary">BD</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              One place to discover Bangladesh — its beaches, hill tracks, heritage sites and tea
              country — and to plan the whole trip end to end.
            </p>

            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <FaLocationDot className="mt-1 h-3 w-3 shrink-0 text-primary" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaPhone className="mt-1 h-3 w-3 shrink-0 text-primary" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaEnvelope className="mt-1 h-3 w-3 shrink-0 text-primary" />
                <span>support@travlabd.com</span>
              </li>
            </ul>
          </div>

          <FooterColumn title="Destinations" links={destinationLinks} />
          <FooterColumn title="Plan a trip" links={planLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-border pt-7 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Travla BD. Built as a university software engineering
            project.
          </p>

          <div className="flex items-center gap-1.5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
