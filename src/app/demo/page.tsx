"use client";

import React from "react";
import Link from "next/link";
import { FormInput, FormSelect, FormTextarea } from "@/components/shared";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  return (
    <div className="min-h-screen p-8 bg-slate-950 text-white max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Travla Component Showcase</h1>
      <p className="text-slate-400">Shared Shadcn Form Components Demo</p>

      <div className="space-y-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <FormInput label="Full Name" placeholder="John Doe" />
        <FormSelect
          label="Destination"
          options={[
            { label: "Cox's Bazar", value: "coxs-bazar" },
            { label: "Paharpur, Naogaon", value: "paharpur" },
            { label: "Bandarban", value: "bandarban" },
            { label: "Sylhet", value: "sylhet" },
          ]}
        />
        <FormTextarea label="Travel Notes" placeholder="Special requirements..." />
      </div>

      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
