import { ThemeMenu } from "@/components/ThemeMenu";
import { ExploreSectionCard } from "@/components/ExploreSectionCard";
import { ProjectCard } from "@/components/ProjectCard";

import Link from "next/link";
import {Navigation} from "@/components/Navigation";

export default function HomePage() {
  return (
      <>
        <Navigation/>

        <div id="scrollRoot" className="os-root">
        <main className="container container-max px-3 px-md-4 py-4 py-md-5">
          <section className="glass p-4 p-md-5 rounded-4 position-relative overflow-hidden">
            <div className="row g-4 align-items-center">
              <div className="col-lg-8">
                <h1 className="display-6 fw-semibold lh-sm mb-2">
                  lichtspiele.org ist mein Spielplatz für Musik, Software und Nerd-Kram. Und Lichter.
                </h1>
                <p className="muted mb-0">
                  Hi, ich bin Tristan. Hier sammle ich Tools, Experimente und alles andere.
                </p>
              </div>
              <div className="col-lg-4">
                <div className="d-grid gap-2">
                  <a className="btn btn-primary" href="#">Neueste Projekte</a>
                  <a className="btn btn-outline-primary" href="#">Musik hören</a>
                  <a className="btn btn-outline-secondary" href="#">Dev & Code</a>
                </div>
              </div>
            </div>

            <div className="row g-3 mt-4">
              {[
                { icon: "〰", title: "Neue Projekte", text: "Was gerade aktiv ist (und was ich als Nächstes kaputtoptimiere).", cta: "Entdecken →" },
                { icon: "🎧", title: "Musik", text: "Tracks, Releases, Lyrics – und gelegentlich ein Sideproject.", cta: "Anhören →" },
                { icon: "</>", title: "Dev", text: "Tools, Automations, Nerdkram. Kurz, praktisch, nachvollziehbar.", cta: "Mehr →" },
              ].map((c) => (
                  <div className="col-lg-4">
                    <ExploreSectionCard
                        icon={c.icon}
                        title={c.title}
                        description={c.text}
                        href="#"
                        ctaText={c.cta}
                    />
                  </div>
              ))}
            </div>
          </section>

          <section className="mt-4 mt-md-5">
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
              <div>
                <h2 className="h4 mb-1">Neueste Projekte</h2>
                <div className="muted small">Highlights – später gern mit Filter/Tags ausbaubar.</div>
              </div>
              <a className="btn btn-sm btn-outline-secondary" href="#">Alle Projekte</a>
            </div>

            <div className="row g-3">
              {[
                { title: "Nora Dax – Release / Workbench", tags: ["Musik", "Aktiv"], text: "Tracks, Prompts, Cover-Assets – alles an einem Ort, sauber versioniert." },
                { title: "Automation Scripts / Ops-Tools", tags: ["Dev", "Perl", "Ansible"], text: "Pragmatische Tools: weniger Klickorgien, mehr robuste Prozesse." },
                { title: "ESP32 / Controller-Bastelei", tags: ["Hardware", "Aktiv"], text: "PWM, Sensorik, LEDs – und genug Overengineering für drei Projekte." },
                { title: "Game Builds / Creative Stuff", tags: ["Gaming", "Creative"], text: "Server, Tools, Builds, Layouts – eher „machen“ als nur spielen." },
              ].map((p) => (
                  <div className="col-12 col-md-6 col-xl-3" key={p.title}>
                    <div className="card glass-2 rounded-4 overflow-hidden h-100">
                      <div className="card-header glass-header py-2">
                        <div className="d-flex gap-2 flex-wrap">
                          {p.tags.slice(0, 2).map((t) => (
                              <span className="badge text-bg-secondary" key={t}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="proj-thumb" />
                      <div className="card-body p-3">
                        <div className="fw-semibold">{p.title}</div>
                        <p className="muted small mt-2 mb-3">{p.text}</p>
                        <a className="btn btn-sm btn-outline-secondary w-100" href="#">Zum Projekt →</a>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            <footer className="mt-5 pt-4 border-top" style={{ borderColor: "var(--line)" }}>
              <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center">
                <div className="muted small">© {new Date().getFullYear()} lichtspiele.org · <Link href="/impressum" className="text-decoration-none text-primary">🦄 Impressum</Link></div>
                <div className="d-flex gap-2 flex-wrap">
                  <a className="btn btn-sm btn-outline-secondary" href="http://github.com/d1rty-pixel/" target="_blank">GitHub</a>
                  <a className="btn btn-sm btn-outline-secondary" href="#">YouTube</a>
                  <a className="btn btn-sm btn-outline-secondary" href="#">SoundCloud</a>
                  <a className="btn btn-sm btn-outline-secondary" href="#">Mail</a>
                </div>
              </div>
            </footer>
          </section>
        </main>
        </div>
      </>
  );
}
