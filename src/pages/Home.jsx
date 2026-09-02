import React from "react";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import CaseStudies from "@/components/site/CaseStudies";
import ROI from "@/components/site/ROI";
import Protocol from "@/components/site/Protocol";
import ProtocolloTech from "@/components/site/ProtocolloTech";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="relative bg-obsidian min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Services />
        <CaseStudies />
        <ROI />
        <Protocol />
        <ProtocolloTech />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}