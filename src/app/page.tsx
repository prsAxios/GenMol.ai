import Index from "@/components/dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "GenMol.ai",
  description: "Saas Platform for protein folding, docking and molecular dynamics",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Index />
      </DefaultLayout>
    </>
  );
}
