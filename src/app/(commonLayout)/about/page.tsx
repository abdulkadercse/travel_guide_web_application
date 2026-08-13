import type { Metadata } from "next";
import AboutContainer from "@/components/ui/about/aboutContainer";

export const metadata: Metadata = {
  title: "About · Travla BD",
  description:
    "Travla BD brings destinations, stays, restaurants, transport and trip planning across Bangladesh into a single platform.",
};

export default function AboutPage() {
  return <AboutContainer />;
}
