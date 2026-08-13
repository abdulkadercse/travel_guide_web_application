import type { Metadata } from "next";
import ContactContainer from "@/components/ui/contact/ContactContainer";

export const metadata: Metadata = {
  title: "Contact Us · Travla BD",
  description:
    "Get in touch with the Travla BD team. Whether you have a question, need help planning your trip, or want to share feedback, our team is here for you.",
};

export default function ContactPage() {
  return <ContactContainer />;
}
