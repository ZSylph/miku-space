import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import { getSiteStats } from "@/lib/site-stats";
import TimelineListing from "@/components/pages/TimelineListing";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const [rawNotes, stats] = await Promise.all([
    prisma.note.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    getSiteStats(),
  ]);

  // Parse inline tags and build tag objects for sidebar filtering
  const notes = rawNotes.map((n) => ({
    ...n,
    parsedTags: parseTags(n.tags),
  }));

  // Extract unique tags from all notes
  const allTagNames = [...new Set(notes.flatMap((n) => n.parsedTags))];
  const tags = allTagNames.map((name) => ({
    id: name,
    name,
    slug: name,
  }));

  return (
    <TimelineListing
      items={notes}
      tags={tags}
      stats={stats}
      section="notes"
      hrefPrefix="/notes"
      emptyLabel="笔记"
      unitLabel="篇笔记"
    />
  );
}
