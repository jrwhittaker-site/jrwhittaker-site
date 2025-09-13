"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Film, Mail, Linkedin, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import contact from "@/data/contact.json";
import projects from "@/data/projects.json";
import talks from "@/data/talks.json";
import about from "@/data/about.json";

const Section = ({ id, title, eyebrow, children }: { id: string; title: string; eyebrow?: string; children: React.ReactNode }) => (
  <section id={id} className="max-w-6xl mx-auto px-6 py-20">
    <div className="mb-10">
      {eyebrow && <p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
    </div>
    {children}
  </section>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs bg-muted text-muted-foreground">{children}</span>
);

const PLACEHOLDER_VIMEO_ID = "00000000";
const KINDS = ["All", ...Array.from(new Set(projects.map(p => p.kind)))];

function useProjectFilter() {
  const [active, setActive] = useState<string>("All");
  const filtered = useMemo(() => (active === "All" ? projects : projects.filter((p) => p.kind === active)), [active]);
  return { active, setActive, filtered };
}

const FilterPillCtx = React.createContext<{ active: string; setActive: (k: string) => void }>({ active: "All", setActive: () => {} });

function FilterPill({ label }: { label: string }) {
  const { active, setActive } = React.useContext(FilterPillCtx);
  const isActive = active === label;
  return (
    <button onClick={() => setActive(label)} className={`px-3 py-1 rounded-full text-xs border transition ${isActive ? "bg-foreground text-background" : "bg-background hover:bg-muted text-foreground"}`}>
      {label}
    </button>
  );
}

function ProjectGrid({ onOpen }: { onOpen: (slug: string) => void }) {
  const state = useProjectFilter();
  return (
    <FilterPillCtx.Provider value={{ active: state.active, setActive: state.setActive }}>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {KINDS.map((k) => (<FilterPill key={k} label={k} />))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.filtered.map((p) => (
          <button key={p.slug} onClick={() => onOpen(p.slug)} className="group block rounded-2xl overflow-hidden border bg-muted/20 text-left">
            <div className="aspect-[4/3] relative overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.03] flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-muted to-background" />
                <div className="absolute bottom-3 right-3 text-[10px] opacity-70">{p.year}</div>
              </div>
            </div>
            <div className="p-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-medium leading-tight">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.blurb}</p>
              </div>
              <span className="text-xs mt-1 px-2 py-0.5 rounded-full border">{p.kind}</span>
            </div>
          </button>
        ))}
      </div>
    </FilterPillCtx.Provider>
  );
}

function ProjectModal({ slug, onClose, onPrev, onNext }: { slug: string | null; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  if (!slug) return null;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-black/70" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }} className="relative z-50 max-w-4xl mx-auto mt-16 mb-10 bg-background rounded-2xl shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full border">{project.kind}</span>
            <h3 className="text-lg font-medium">{project.title}</h3>
            <span className="text-xs text-muted-foreground">• {project.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onPrev} className="p-1 rounded hover:bg-muted" aria-label="Previous project">‹</button>
            <button onClick={onNext} className="p-1 rounded hover:bg-muted" aria-label="Next project">›</button>
            <button onClick={onClose} className="p-1 rounded hover:bg-muted" aria-label="Close project"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.05 }} className="aspect-video w-full bg-black">
          <iframe src={`https://player.vimeo.com/video/${PLACEHOLDER_VIMEO_ID}`} className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={`${project.title} — Vimeo`} />
        </motion.div>
        <div className="px-5 py-4 text-sm text-muted-foreground"><p>{project.blurb}</p></div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const currentIndex = openSlug ? projects.findIndex((p) => p.slug === openSlug) : -1;
  const prevSlug = currentIndex > -1 ? projects[(currentIndex - 1 + projects.length) % projects.length].slug : null;
  const nextSlug = currentIndex > -1 ? projects[(currentIndex + 1) % projects.length].slug : null;

  useEffect(() => {
    if (!openSlug) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
      if (e.key === "ArrowLeft" && prevSlug) setOpenSlug(prevSlug);
      if (e.key === "ArrowRight" && nextSlug) setOpenSlug(nextSlug);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prevOverflow; window.removeEventListener("keydown", onKey); };
  }, [openSlug, prevSlug, nextSlug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/90 border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="font-semibold tracking-tight">{contact.name}</a>
          <nav className="hidden sm:flex gap-6 text-sm">
            <a href="#work" className="hover:opacity-80">Work</a>
            <a href="#talks" className="hover:opacity-80">Speaking</a>
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#press" className="hover:opacity-80">Press</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm"><a href="#contact">Let’s collaborate</a></Button>
          </div>
        </div>
      </div>

      <header id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-background/80">
              <Pill>Director</Pill><Pill>Producer</Pill><Pill>Educator</Pill>
            </div>
            <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight">{contact.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">I build stories, teams, and systems that move people—from prestige docuseries and VR to globally taught directing workshops and industry simulations.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><a href={contact.vimeo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2"><Film className="w-4 h-4" /> Watch Reel <ArrowRight className="w-4 h-4" /></a></Button>
              <Button asChild variant="outline"><a href="#work" className="inline-flex items-center gap-2">Selected Work</a></Button>
              <Button asChild variant="ghost"><a href={contact.linkedin} className="inline-flex items-center gap-2" target="_blank" rel="noreferrer"><Linkedin className="w-4 h-4" /> LinkedIn</a></Button>
            </div>
          </motion.div>
        </div>
      </header>

      <Section id="work" title="Selected Work" eyebrow="Portfolio">
        <ProjectGrid onOpen={(slug) => setOpenSlug(slug)} />
      </Section>

      <Section id="talks" title="Speaking & Workshops" eyebrow="What I Teach">
        <div className="grid md:grid-cols-3 gap-6">
          {talks.map((t, i) => (
            <Card key={i}><CardHeader className="space-y-1"><CardTitle className="text-lg">{t.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{t.copy}</p></CardContent></Card>
          ))}
        </div>
      </Section>

      <Section id="about" title="About" eyebrow="Bio">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4 text-muted-foreground">{about.paragraphs.map((p: string, i: number) => (<p key={i}>{p}</p>))}</div>
          <div><div className="rounded-2xl border p-4 bg-muted/30"><h3 className="font-semibold mb-3">Quick facts</h3><ul className="space-y-2 text-sm text-muted-foreground">{about.facts.map((f: string, i: number) => (<li key={i}>• {f}</li>))}</ul></div></div>
        </div>
      </Section>

      <Section id="contact" title="Let’s build something" eyebrow="Contact">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-muted-foreground">
            <p>For collaborations, speaking, or workshops, email me directly or drop a short brief. I aim for projects with creative courage and measurable impact.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild><a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {contact.email}</a></Button>
              <Button asChild variant="outline"><a href={contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</a></Button>
            </div>
          </div>
          <Card><CardHeader><CardTitle className="text-lg">Project inquiry</CardTitle></CardHeader><CardContent>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Thanks! I’ll get back to you shortly."); }}>
              <input className="w-full border rounded-2xl px-3 py-2 bg-background" placeholder="Your name" required />
              <input className="w-full border rounded-2xl px-3 py-2 bg-background" placeholder="Email" type="email" required />
              <input className="w-full border rounded-2xl px-3 py-2 bg-background" placeholder="Company / Org (optional)" />
              <textarea className="w-full border rounded-2xl px-3 py-2 bg-background min-h-[120px]" placeholder="What are we making together?" required />
              <div className="flex items-center gap-2 flex-wrap"><Pill>Doc / Series</Pill><Pill>Brand / Client</Pill><Pill>Workshop</Pill><Pill>Keynote</Pill></div>
              <Button type="submit" className="inline-flex items-center gap-2">Send <ArrowRight className="w-4 h-4" /></Button>
            </form>
          </CardContent></Card>
        </div>
      </Section>

      <footer className="border-t"><div className="max-w-6xl mx-auto px-6 py-10 text-sm text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {contact.name}. All rights reserved.</p>
        <div className="flex items-center gap-4"><a href="#privacy" className="hover:opacity-80">Privacy</a><a href="#legal" className="hover:opacity-80">Legal</a><a href="#contact" className="hover:opacity-80">Contact</a></div>
      </div></footer>

      <ProjectModal slug={openSlug} onClose={() => setOpenSlug(null)} onPrev={() => prevSlug && setOpenSlug(prevSlug)} onNext={() => nextSlug && setOpenSlug(nextSlug)} />
    </div>
  );
}
