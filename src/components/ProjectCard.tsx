import React from "react";

export type ProjectTag = {
    label: string;
    variant?: "secondary" | "primary" | "success" | "warning" | "danger" | "info" | "light" | "dark";
};

export type ProjectCardProps = {
    title: string;
    description?: string;
    href?: string;

    /** Tags im Header (Badges). */
    tags?: ProjectTag[];

    /** Optionaler “Status” Badge rechts im Header (z.B. Active/Beta). */
    status?: ProjectTag;

    /** Optionaler CTA Text */
    ctaText?: string;

    /** Optional: eigenes Thumbnail (statt default .proj-thumb) */
    thumb?: React.ReactNode;

    /** Optional: Extra Klassen für Wrapper */
    className?: string;
};

export function ProjectCard({
                                title,
                                description,
                                href = "#",
                                tags = [],
                                status,
                                ctaText = "Zum Projekt →",
                                thumb,
                                className,
                            }: ProjectCardProps) {
    const badgeClass = (v: NonNullable<ProjectTag["variant"]>) => `badge text-bg-${v}`;

    return (
        <div className={"card glass-2 rounded-4 overflow-hidden h-100 " + (className ?? "")}>
            <div className="card-header glass-header py-2 d-flex align-items-center justify-content-between gap-2">
                <div className="d-flex gap-2 flex-wrap">
                    {tags.map((t, idx) => (
                        <span key={`${t.label}-${idx}`} className={badgeClass(t.variant ?? "secondary")}>
              {t.label}
            </span>
                    ))}
                </div>

                {status ? (
                    <span className={badgeClass(status.variant ?? "secondary")}>
            {status.label}
          </span>
                ) : null}
            </div>

            {thumb ? (
                <div>{thumb}</div>
            ) : (
                <div className="proj-thumb" />
            )}

            <div className="card-body p-3 d-flex flex-column">
                <div className="fw-semibold">{title}</div>
                {description ? <p className="muted small mt-2 mb-3">{description}</p> : <div className="mb-3" />}

                <a className="btn btn-sm btn-outline-secondary w-100 mt-auto" href={href}>
                    {ctaText}
                </a>
            </div>
        </div>
    );
}
