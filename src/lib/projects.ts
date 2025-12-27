import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ProjectMeta = {
    slug: string;
    title: string;
    date: string; // ISO (YYYY-MM-DD)
    tags?: string[];
    status?: string;
};

const DIR = path.join(process.cwd(), "src", "content", "projects");

function assertMeta(slug: string, data: any): ProjectMeta {
    if (!data?.title || !data?.date) {
        throw new Error(`Project "${slug}" is missing required frontmatter: title/date`);
    }
    return {
        slug,
        title: String(data.title),
        date: String(data.date),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        status: data.status ? String(data.status) : undefined,
    };
}

export function getAllProjects(): ProjectMeta[] {
    const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));
    const metas = files.map((file) => {
        const slug = file.replace(/\.mdx$/, "");
        const raw = fs.readFileSync(path.join(DIR, file), "utf8");
        const { data } = matter(raw);
        return assertMeta(slug, data);
    });

    // neueste zuerst
    metas.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return metas;
}

export function getLatestProjects(n: number): ProjectMeta[] {
    return getAllProjects().slice(0, n);
}
