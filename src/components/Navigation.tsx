import {ThemeMenu} from "@/components/ThemeMenu";

export function Navigation() {

    return (
        <nav
            className="navbar navbar-expand-lg fixed-top"
            style={{
                backdropFilter: "blur(10px)",
            }}
        >
            <div className="container container-max py-2">
                <a className="navbar-brand fw-bold ls-navbar-brand" href="/">
                    <span className="ls-brand-word" data-text="lichtspiele">lichtspiele</span>
                    <span className="opacity-50">.org</span>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div id="nav" className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto gap-1 align-items-lg-center">
                        <li className="nav-item"><a className="nav-link active" href="/">Home</a></li>
                        <li className="nav-item"><a className="nav-link active" href="/projects">Projekte</a></li>
                        <li className="nav-item"><a className="nav-link" href="/about">Me, Myself & I</a></li>

                        <li className="nav-item ms-lg-2"><ThemeMenu/></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};