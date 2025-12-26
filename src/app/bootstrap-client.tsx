"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
    useEffect(() => {
        // dropdowns, navbar toggler, etc.
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return null;
}
