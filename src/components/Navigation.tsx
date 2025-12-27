import {ThemeMenu} from "@/components/ThemeMenu";

export function Navigation() {
    return (
        <nav
            className="navbar navbar-expand-lg sticky-top"
            style={{
                borderBottom: "1px solid var(--line)",
                background: "color-mix(in srgb, var(--panel2) 65%, transparent)",
                backdropFilter: "blur(10px)",
            }}
        >
            <div className="container container-max py-2">
                <a className="navbar-brand fw-bold" href="#">
                    lichtspiele<span className="opacity-50">.org</span>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div id="nav" className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto gap-1 align-items-lg-center">
                        <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="/projects">Projekte</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Musik</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Dev</a></li>
                        <li className="nav-item ms-lg-2"><ThemeMenu/></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};