import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: (p) => <h1 className="h2 mb-3" {...p} />,
        h2: (p) => <h2 className="h4 mt-4 mb-2" {...p} />,
        p: (p) => <p className="mb-3" {...p} />,
        a: (p) => <a className="link-primary" {...p} />,
        ul: (p) => <ul className="mb-3" {...p} />,
        Callout,
        ...components,
    };
}

function Callout({
                     variant = "secondary",
                     children,
                 }: {
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
    children: React.ReactNode;
}) {
    return (
        <div className={`alert alert-${variant} glass-2 rounded-4 border-0`} style={{ border: "1px solid var(--line)" }}>
            {children}
        </div>
    );
}
