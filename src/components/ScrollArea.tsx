"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function ScrollArea({ children }: { children: React.ReactNode }) {
    return (
        <OverlayScrollbarsComponent
            options={{
                overflow: { x: "hidden", y: "scroll" },
                scrollbars: {
                    autoHide: "leave",
                },
            }}
            defer
            style={{ height: "var(--vvh)" }}
        >
            {children}
        </OverlayScrollbarsComponent>
    );
}