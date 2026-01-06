import {ExploreSectionCard} from "@/components/ExploreSectionCard";
import {ProjectCard} from "@/components/ProjectCard";
import {getLatestProjects} from "@/lib/projects";

export default function HomePage() {
    return (
        <>
            <section className="glass p-4 p-md-5 rounded-4 position-relative overflow-hidden">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-8">
                        <h1 className="display-6 fw-semibold lh-sm mb-2">
                            lichtspiele.org ist mein Spielplatz für Software, Nerd-Kram und Musik.
                        </h1>
                        <p className="muted pt-3">Hi, ich bin Tristan.</p>
                        <p className="muted mb-0">
                            Hier sammle ich Tools, Software, Experimente, Gebastel und alles andere.
                        </p>
                        <p className="muted">Und Lichter.</p>
                    </div>
                </div>

                <div className="row g-3 mt-4">
                    {[
                        {
                            iconClass: "fa-solid fa-diagram-project",
                            title: "Projekte",
                            text: "Was gerade so passiert. Und was ich als Nächstes kaputt-optimiere...",
                            cta: "Entdecken",
                        },
                        {
                            iconClass: "fa-solid fa-music",
                            title: "Musik",
                            text: "Tracks Releases und Lyrics – und gelegentlich ein Sideproject.",
                            cta: "Anhören",
                        },
                        {
                            iconClass: "fa-solid fa-code",
                            title: "Dev",
                            text: "Tools, Automationen und weirder Nerdkram.",
                            cta: "Mehr",
                        },
                    ].map((c, i) => (
                        <div className="col-lg-4" key={i}>
                            <ExploreSectionCard
                                iconClass={c.iconClass}
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
                        <h2 className="h4 mb-1">Neuester Kram</h2>
                    </div>
                    <a className="btn btn-sm btn-outline-secondary" href="/projects">
                        Alle Projekte
                    </a>
                </div>

                <div className="row g-3">
                    {getLatestProjects(4).map((p) => (
                        <div className="col-12 col-md-6 col-xl-3" key={p.slug}>
                            <ProjectCard
                                title={p.title}
                                tags={(p.tags ?? []).slice(0, 2).map((t) => ({label: t}))}
                                status={p.status ? {label: p.status, variant: "success"} : undefined}
                                href={`/projects/${p.slug}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="row g-3 mt-3">
                    {[
                        {
                            title: "Nora Dax – Release / Workbench",
                            tags: ["Musik", "Aktiv"],
                            text: "Tracks, Prompts, Cover-Assets – alles an einem Ort, sauber versioniert.",
                        },
                        {
                            title: "Automation Scripts / Ops-Tools",
                            tags: ["Dev", "Perl", "Ansible"],
                            text: "Pragmatische Tools: weniger Klickorgien, mehr robuste Prozesse.",
                        },
                        {
                            title: "ESP32 / Controller-Bastelei",
                            tags: ["Hardware", "Aktiv"],
                            text: "PWM, Sensorik, LEDs – und genug Overengineering für drei Projekte.",
                        },
                        {
                            title: "Game Builds / Creative Stuff",
                            tags: ["Gaming", "Creative"],
                            text: "Server, Tools, Builds, Layouts – eher „machen“ als nur spielen.",
                        },
                    ].map((p) => (
                        <div className="col-12 col-md-6 col-xl-3" key={p.title}>
                            <div className="card glass-2 rounded-4 overflow-hidden h-100">
                                <div className="card-header glass-header py-2">
                                    <div className="d-flex gap-2 flex-wrap">
                                        {p.tags.slice(0, 2).map((t) => (
                                            <span className="badge text-bg-secondary" key={t}>
                        {t}
                      </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="proj-thumb"/>
                                <div className="card-body p-3">
                                    <div className="fw-semibold">{p.title}</div>
                                    <p className="muted small mt-2 mb-3">{p.text}</p>
                                    <a className="btn btn-sm btn-outline-secondary w-100" href="#">
                                        Zum Projekt →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
