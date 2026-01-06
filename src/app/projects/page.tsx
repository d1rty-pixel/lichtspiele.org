import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";

export default function ProjectsPage() {
    const projects = getAllProjects();

    return (
        <>
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2 mb-3">
                <div>
                    <h1 className="h3 mb-1">Projekte</h1>
                    <div className="muted small">{projects.length} Einträge</div>
                </div>
                <Link className="btn btn-sm btn-outline-secondary" href="/">
                    Zur Startseite
                </Link>
            </div>

            <div className="row g-3">
                {projects.map((p) => (
                    <div className="col-12 col-md-6 col-xl-3" key={p.slug}>
                        <ProjectCard
                            title={p.title}
                            description={p.tags?.length ? p.tags.join(" · ") : undefined}
                            tags={(p.tags ?? []).slice(0, 2).map((t) => ({ label: t }))}
                            status={p.status ? { label: p.status, variant: "success" } : undefined}
                            href={`/projects/${p.slug}`}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
