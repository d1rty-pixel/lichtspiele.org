import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { useMDXComponents } from "@/mdx-components";

export const runtime = "nodejs";

const DIR = path.join(process.cwd(), "src", "content", "projects");

export async function generateStaticParams() {
    const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));
    return files.map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export default async function ProjectPage({params}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const file = path.join(DIR, `${slug}.mdx`);
    if (!fs.existsSync(file)) return notFound();

    const raw = fs.readFileSync(file, "utf8");
    const { content, data } = matter(raw);

    const components = useMDXComponents({});

    const { content: MDXContent } = await compileMDX({
        source: content,
        components,
        options: { parseFrontmatter: false },
    });

    return (
        <main className="container container-max px-3 px-md-4 py-4 py-md-5">
            <div className="glass p-4 p-md-5 rounded-4">
                {data?.title ? <h1 className="h2 mb-3">{String(data.title)}</h1> : null}
                {MDXContent}
            </div>
        </main>
    );
}