import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="mt-5 pt-4 border-top" style={{ borderColor: "var(--line)" }}>
            <div className="d-flex flex-wrap justify-content-between gap-2 align-items-center">
                <div className="muted small">
                    © {new Date().getFullYear()} lichtspiele.org ·{" "}
                    <Link href="/impressum" className="text-decoration-none text-primary">
                        🦄 Impressum
                    </Link>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <a
                        className="btn btn-sm btn-outline-secondary"
                        href="http://github.com/d1rty-pixel/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                    <a className="btn btn-sm btn-outline-secondary" href="#" target="_blank" rel="noreferrer">
                        YouTube
                    </a>
                    <a className="btn btn-sm btn-outline-secondary" href="#" target="_blank" rel="noreferrer">
                        SoundCloud
                    </a>
                    <a className="btn btn-sm btn-outline-secondary" href="#">
                        Mail
                    </a>
                </div>
            </div>
        </footer>
    );
}
