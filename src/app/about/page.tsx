// app/about/page.tsx

import AsciiPortrait from "@/components/AsciiPortrait";

export default function AboutPage() {
    return (
        <section>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">

                    {/* HERO */}
                    <div className="mb-4">
                        <div className="text-uppercase small text-secondary mb-2">lichtspiele.org</div>
                        <h1 className="display-6 mb-3">About</h1>

                        <p className="fs-5 mb-3">
                            Ich baue Software und Web-Experimente – beruflich im Anti-Abuse-Umfeld, privat alles,
                            worauf ich gerade Lust habe: Tools, Interfaces, kleine Systeme, manchmal Musik.
                        </p>

                        <p className="mb-0 text-secondary mb-3">
                            Bei IONOS SE entwickle ich Systeme, die Missbrauch in Hosting-/Plattform-Infrastrukturen erkennen
                            und für Teams bearbeitbar machen: Detection, Triage, Automatisierung – plus die Prozesse drumherum.
                        </p>

                        <blockquote className="blockquote fst-italic text-secondary mb-3">
                            less talk, more walk
                        </blockquote>

                    </div>

                    <hr className="my-4" />

                    {/* TWO COLUMNS: editorial, not CV */}
                    <div className="row g-4">
                        <div className="col-12 col-lg-7">
                            <h2 className="h5 mb-3">
                                <i className="fa-solid fa-wrench me-2" aria-hidden="true" />
                                Woran ich gerne schraube
                            </h2>

                            <ul className="mb-0">
                                <li className="mb-2">
                                    Systeme, die in der Realität funktionieren: klare Zustände, saubere Schnittstellen, wenig Magie.
                                </li>
                                <li className="mb-2">
                                    Prozess-/Workflow-Steuerung: Zuständigkeiten, Eskalationen, Freigaben, Nachvollziehbarkeit.
                                </li>
                                <li className="mb-2">
                                    Expert-UIs für interne Teams: schnelle Bedienung, gute Defaults, “power user first”.
                                </li>
                                <li className="mb-0">
                                    Betrieb/Observability: Logging, Metriken, Reports – damit man Problemen nicht hinterherläuft.
                                </li>
                            </ul>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="p-3 p-lg-4 rounded-3 bg-body-tertiary">
                                <h2 className="h6 mb-3">
                                    <i className="fa-solid fa-layer-group me-2" aria-hidden="true" />
                                    Features
                                </h2>

                                <div className="d-flex flex-wrap gap-2">
                  <span className="badge text-bg-dark">
                    <i className="fa-brands fa-perl me-2" aria-hidden="true" />
                    Perl
                  </span>
                                    <span className="badge text-bg-dark">
                    <i className="fa-solid fa-database me-2" aria-hidden="true" />
                    SQL
                  </span>
                                    <span className="badge text-bg-dark">
                    <i className="fa-brands fa-linux me-2" aria-hidden="true" />
                    Linux
                  </span>
                                    <span className="badge text-bg-dark">
                    <i className="fa-solid fa-gears me-2" aria-hidden="true" />
                    Automation
                  </span>
                                    <span className="badge text-bg-dark">
                    <i className="fa-solid fa-code me-2" aria-hidden="true" />
                    APIs
                  </span>
                                    <span className="badge text-bg-dark">
                    <i className="fa-solid fa-eye me-2" aria-hidden="true" />
                    Observability
                  </span>
                                </div>

                                <hr className="my-3" />

                                {/* CTAs = macht’s weniger “Lebenslauf” */}
                                <div className="d-grid gap-2">
                                    <a className="btn btn-primary" href="/projects">
                                        <i className="fa-solid fa-arrow-right me-2" aria-hidden="true" />
                                        Zu den Projekten
                                    </a>
                                    <a className="btn btn-outline-secondary" href="/me-myself-i">
                                        <i className="fa-solid fa-feather-pointed me-2" aria-hidden="true" />
                                        Me, Myself &amp; I
                                    </a>
                                </div>

                                <div className="small text-secondary mt-3">
                                    Wenn du nur eine Sache mitnimmst: Ich mag Systeme, die man versteht – und die man betreiben kann.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OPTIONAL: tiny footer line */}
                    <div className="mt-4 small text-secondary">
                        <i className="fa-solid fa-terminal me-2" aria-hidden="true" />
                        status: ok · stack: perl / sql / linux
                    </div>

                </div>
            </div>
        </section>
    );
}
