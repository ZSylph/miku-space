import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">学习笔记</h1>
      <div className="space-y-4">
        {notes.map((note) => (
          <Link key={note.id} href={`/notes/${note.slug}`}>
            <div className="rounded-lg border p-6 hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                {note.category && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
                    {note.category}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-lg">{note.title}</h2>
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(note.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
