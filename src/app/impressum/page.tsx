import type { Metadata } from "next";
import {Navigation} from "@/components/Navigation";

export const metadata: Metadata = {
    title: "Impressum – lichtspiele.org",
};

export default function ImpressumPage() {
    return (
        <>
        <Navigation/>

        <main className="container container-max px-3 px-md-4 py-4 py-md-5">
            <h1>Impressum</h1>

            <p>
                Angaben gemäß § 5 TMG
            </p>

            <p>
                Tristan Cebulla<br />
                Hintergasse 5a<br />
                55606 Oberhausen
            </p>

            <h2>Kontakt</h2>
            <p>
                E-Mail: legal@lichtspiele.org
            </p>
        </main>
        </>
    );
}
