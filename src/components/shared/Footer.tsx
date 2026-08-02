"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaCompass,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaPaperPlane,
  FaShieldAlt,
  FaHeart
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-200 border-t border-slate-800/80 pt-14 pb-8 font-sans relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10 space-y-12">


        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <FaCompass className="h-7 w-7 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="text-2xl font-extrabold tracking-wider text-white">
                Travla<span className="text-indigo-400">BD</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Travla BD is Bangladesh&apos;s premier travel and tourism platform. We bring you unforgettable journeys across Cox&apos;s Bazar, Naogaon Paharpur, Bandarban, and Sylhet.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-400 shrink-0" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-indigo-400 shrink-0" />
                <span>+880 1700-000000 / +880 9600-112233</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-400 shrink-0" />
                <span>support@travlabd.com</span>
              </p>
            </div>
          </div>

          {/* Col 2: Top Destinations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Destinations</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Cox&apos;s Bazar Beach</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Paharpur, Naogaon</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Nilgiri, Bandarban</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Sylhet Tea Gardens</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Sundarbans Forest</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Saint Martin Island</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-indigo-400 transition-colors">Tour Packages</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">My Account</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-400 transition-colors">Register Account</Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-indigo-400 transition-colors">Component Showcase</Link>
              </li>
              <li>
                <Link href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Follow & Connect</h4>
            <p className="text-xs text-slate-400">Join our travel community for photos, stories & guides:</p>
            
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <FaShieldAlt className="text-emerald-400 h-4 w-4" />
                <span>100% Safe & Secure Booking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} Travla BD. Crafted with <FaHeart className="text-rose-500 inline h-3 w-3" /> for travelers in Bangladesh.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-200 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:text-slate-200 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;