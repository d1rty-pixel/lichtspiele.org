import type { Metadata } from "next";
import "./globals.css";

import "@/styles/main.scss";
import "overlayscrollbars/overlayscrollbars.css";

import BootstrapClient from "./bootstrap-client";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LightsCanvas } from "@/components/LightsCanvas";

export const metadata: Metadata = {
  title: "lichtspiele.org",
  description: "Lichtspiele: Musik, Software und Nerd-Projekte.",
};

import "overlayscrollbars/styles/overlayscrollbars.css";
import OSInit from "./os-init";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="de" data-theme="studio" data-bs-theme="dark">
      <body>
      <div className="fx" aria-hidden="true">
        <LightsCanvas />
        <div className="grain" />
        <div className="noise" />
      </div>

      <ThemeProvider>{children}</ThemeProvider>

      <BootstrapClient />
      </body>
      <OSInit />
      </html>
  );
}