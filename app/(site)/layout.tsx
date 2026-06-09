import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MusicProvider from "@/components/music/MusicProvider";
import type { SongInfo } from "@/components/music/MusicProvider";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch songs for global player
  const songs = await prisma.song.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const songData: SongInfo[] = songs.map((s) => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    audioUrl: s.audioUrl,
    coverUrl: s.coverUrl,
    duration: s.duration,
  }));

  return (
    <MusicProvider songs={songData}>
      <div className="flex min-h-screen flex-col bg-light-base dark:bg-dark-base transition-[background-color] duration-300">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-6xl px-6 md:px-12 pt-20 pb-6">
          {children}
        </main>
        <Footer />
      </div>
    </MusicProvider>
  );
}
