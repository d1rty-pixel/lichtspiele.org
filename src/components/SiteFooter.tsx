import Link from "next/link";

export function SiteFooter() {
    return (
        <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center">
            <div className="muted small">
                © {new Date().getFullYear()} lichtspiele.org{" "}·{" "}
                Crafted with <span className="text-danger">♥</span>
            </div>
            <div className="d-flex gap-2 flex-wrap">
                <Link href="/imprint" className="text-decoration-none text-primary">
                    🦄 Impressum
                </Link>
                {" "}·{" "}
                <Link href="/privacy" className="text-decoration-none text-primary">
                    Datenschutz
                </Link>
            </div>
        </div>
    );
}
