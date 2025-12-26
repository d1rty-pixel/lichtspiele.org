import React from "react";

export type ExploreSectionCardProps = {
    title: string;
    description?: string;

    /** Icon als string (emoji, text, etc.) oder eigenes Node */
    icon?: React.ReactNode;

    href?: string;
    ctaText?: string;

    /** Optional: Header “shine” Effekt an/aus */
    shine?: boolean;

    className?: string;
};

export function ExploreSectionCard({
                                       title,
                                       description,
                                       icon,
                                       href = "#",
                                       ctaText = "Entdecken →",
                                       shine = false,
                                       className,
                                   }: ExploreSectionCardProps) {
    const headerClass = "card-header glass-header py-2 d-flex align-items-center gap-2 border-bottom-0" + (shine ? " shine" : "");

    return (
        <div className={"card glass-2 overflow-hidden h-100 " + (className ?? "")}>
            <div className={headerClass}>
                {icon ? (
                    <span>

            {icon}
                    </span>
                ) : null}
                <span className="fw-semibold fs-5">{title}</span>
            </div>

            <div className="card-body p-3 d-flex flex-column">
                {description ? <div className="muted small mb-3">{description}</div> : <div className="mb-3" />}

                <a className="btn btn-sm btn-outline-secondary w-100 mt-auto" href={href}>
                    {ctaText}
                </a>
            </div>
        </div>
    );
}
