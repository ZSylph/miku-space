import { prisma } from "@/lib/prisma";

export async function getSiteStats() {
  const [posts, notes, works] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.note.count({ where: { published: true } }),
    prisma.work.count(),
  ]);
  return { posts, notes, works };
}
