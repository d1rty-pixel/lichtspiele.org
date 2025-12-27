import type { Metadata } from "next";
import "./globals.css";

import "@/styles/main.scss";

import "overlayscrollbars/overlayscrollbars.css";

import BootstrapClient from "./bootstrap-client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LightsCanvas } from "@/components/lights/LightsCanvas";
import { SnowCanvas } from "@/components/snow/SnowCanvas";

import OSInit from "./os-init";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
    title: "lichtspiele.org",
    description: "Lichtspiele: Musik, Software und Nerd-Projekte.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de" data-theme="studio" data-bs-theme="dark">
        <body>
        <div className="fx" aria-hidden="true">
            <LightsCanvas />
            <SnowCanvas settings={{ flakes: 180, wind: 0.015, opacity: 0.8 }} />
            <div className="grain" />
            <div className="noise" />
        </div>

        <ThemeProvider>
            <Navigation />

            {/* Scroll-Host für OverlayScrollbars */}
            <div id="scrollRoot" className="os-host os-theme-dark">
                <main className="container container-max px-3 px-md-4 py-4 py-md-5">
                    {children}
                    <SiteFooter />
                </main>
            </div>
        </ThemeProvider>

        <BootstrapClient />
        <OSInit />
        </body>
        </html>
    );
}
