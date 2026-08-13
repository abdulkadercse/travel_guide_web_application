import type { Metadata } from "next";
import TeamContainer from "@/components/ui/team/teamContainer";

export const metadata: Metadata = {
  title: "Our Team · Travla BD",
  description:
    "Meet the development team behind Travla BD — Software Development III (CSE 3292) capstone project at Northern University Bangladesh.",
};

export default function OurTeamPage() {
  return <TeamContainer />;
}
