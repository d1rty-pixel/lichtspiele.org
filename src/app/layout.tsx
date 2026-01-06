import type {Metadata} from "next";

import "./globals.css";
import "@/styles/main.scss";
import "overlayscrollbars/overlayscrollbars.css";

import BootstrapClient from "./bootstrap-client";
import {ThemeProvider} from "@/components/ThemeProvider";
import {LightsCanvas} from "@/components/lights/LightsCanvas";
import {SnowCanvas} from "@/components/snow/SnowCanvas";
import LayoutHeightsFix from "@/components/LayoutHeightsFix";

import {Navigation} from "@/components/Navigation";
import {SiteFooter} from "@/components/SiteFooter";
import ScrollArea from "@/components/ScrollArea";

export const metadata: Metadata = {
    title: "lichtspiele.org",
    description: "Lichtspiele: Musik, Software und Nerd-Projekte.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="de" data-theme="dark" data-bs-theme="dark">
        <body>
        <div className="fx" aria-hidden="true">
            <LightsCanvas/>
            <SnowCanvas settings={{flakes: 180, wind: 0.015, opacity: 0.8}}/>
            <div className="grain"/>
            <div className="noise"/>
        </div>

        <ThemeProvider>
            <Navigation/>

            <ScrollArea>
                <main id="main">
                    <div className="container container-max">{children}</div>
                </main>

                <footer id="site-footer" className="py-4">
                    <div className="container">
                        <SiteFooter/>
                    </div>
                </footer>
            </ScrollArea>
        </ThemeProvider>

        <BootstrapClient/>
        <LayoutHeightsFix/>
        </body>
        </html>
    );
}
