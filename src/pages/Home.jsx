import React from "react";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Models from "@/components/site/Models";
import ManifestoBreak from "@/components/site/ManifestoBreak";
import Products from "@/components/site/Products";
import Materials from "@/components/site/Materials";
import Process from "@/components/site/Process";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="relative bg-obsidian min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Models />
        <ManifestoBreak />
        <Products />
        <Materials />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
