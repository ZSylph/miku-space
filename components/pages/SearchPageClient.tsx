"use client";

import ContentShell from "@/components/layout/ContentShell";
import SearchInput from "@/components/SearchInput";
import ContentCard from "@/components/site/ContentCard";
import WorkCard from "@/components/site/WorkCard";
import { FileText, StickyNote, Briefcase, SearchX } from "lucide-react";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string | null;
  category?: string | null;
  tags: string[];
  createdAt: Date;
}

interface NoteItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string | null;
  tags: string[];
  createdAt: Date;
}

interface WorkItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl?: string | null;
  repoUrl?: string | null;
  techStack: string[];
}

interface TagItem {
  id: string;
  name: string;
  slug: string;
}

interface SearchPageClientProps {
  posts: PostItem[];
  notes: NoteItem[];
  works: WorkItem[];
  query: string;
  stats: { posts: number; notes: number; works: number };
  allTags: TagItem[];
}

export default function SearchPageClient({
  posts,
  notes,
  works,
  query,
  stats,
  allTags,
}: SearchPageClientProps) {
  return (
    <ContentShell section="search" tags={allTags} stats={stats}>
      {(selectedTag) => {
        const filteredPosts = selectedTag
          ? posts.filter((p) => p.tags.includes(selectedTag))
          : posts;
        const filteredNotes = selectedTag
          ? notes.filter((n) => n.tags.includes(selectedTag))
          : notes;
        const filteredWorks = selectedTag ? [] : works;

        const total =
          filteredPosts.length + filteredNotes.length + filteredWorks.length;

        return (
          <div className="space-y-6">
            {/* Search input */}
            <SearchInput defaultValue={query} />

            {query ? (
              <>
                {/* Results summary */}
                <p className="text-sm text-muted-foreground px-1">
                  「{query}」的搜索结果：共 {total} 条
                </p>

                {/* Empty state */}
                {total === 0 && (
                  <div className="flex flex-col items-center py-20">
                    <SearchX className="w-10 h-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground/50 tracking-widest">
                      {selectedTag
                        ? "该标签下无匹配结果"
                        : "未找到相关结果，请尝试其他关键词"}
                    </p>
                  </div>
                )}

                {/* Posts results */}
                {filteredPosts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <FileText className="w-4 h-4 text-miku-primary-dark" />
                      <h2 className="text-sm font-semibold text-foreground">
                        文章
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        ({filteredPosts.length})
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {filteredPosts.map((post) => (
                        <ContentCard
                          key={post.id}
                          item={{ ...post, description: post.content.slice(0, 200) }}
                          href={`/posts/${post.slug}`}
                          variant="list"
                          showExcerpt
                          showTags
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes results */}
                {filteredNotes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <StickyNote className="w-4 h-4 text-miku-pink" />
                      <h2 className="text-sm font-semibold text-foreground">
                        笔记
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        ({filteredNotes.length})
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {filteredNotes.map((note) => (
                        <ContentCard
                          key={note.id}
                          item={{
                            ...note,
                            description: note.content.slice(0, 200),
                          }}
                          href={`/notes/${note.slug}`}
                          variant="list"
                          showTags
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Works results */}
                {filteredWorks.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Briefcase className="w-4 h-4 text-miku-primary-dark" />
                      <h2 className="text-sm font-semibold text-foreground">
                        作品
                      </h2>
                      <span className="text-xs text-muted-foreground">
                        ({filteredWorks.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredWorks.map((work) => (
                        <WorkCard
                          key={work.id}
                          title={work.title}
                          description={work.description}
                          coverUrl={work.coverUrl}
                          repoUrl={work.repoUrl}
                          techStack={work.techStack}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Initial state — no query */
              <div className="flex flex-col items-center py-20">
                <div className="w-12 h-px bg-muted-foreground/15 mb-5" />
                <p className="text-sm text-muted-foreground/50 tracking-widest">
                  输入关键词开始搜索文章、笔记和作品
                </p>
              </div>
            )}
          </div>
        );
      }}
    </ContentShell>
  );
}
