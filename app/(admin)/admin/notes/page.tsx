import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminTable from "@/components/admin/AdminTable";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function NotesPage() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminTable
      title="笔记管理"
      createHref="/admin/notes/new"
      createLabel="新建笔记"
      columns={[
        { key: "title", label: "标题" },
        { key: "slug", label: "Slug" },
        { key: "category", label: "分类" },
        { key: "published", label: "状态" },
        { key: "createdAt", label: "创建时间" },
        { key: "actions", label: "操作", className: "text-right" },
      ]}
      data={notes}
      emptyColSpan={6}
      emptyMessage="暂无笔记，点击右上角新建"
      renderRow={(note) => (
        <tr key={note.id} className="border-b last:border-0">
          <td className="px-4 py-3 font-medium">{note.title}</td>
          <td className="px-4 py-3 text-muted-foreground">{note.slug}</td>
          <td className="px-4 py-3">
            {note.category && (
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {note.category}
              </span>
            )}
          </td>
          <td className="px-4 py-3">
            {note.published ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                已发布
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                草稿
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString("zh-CN")}
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/admin/notes/${note.id}/edit`}
                className="text-primary hover:underline"
              >
                编辑
              </Link>
              <DeleteButton
                apiPath={`/api/notes/${note.id}`}
                itemName="笔记"
              />
            </div>
          </td>
        </tr>
      )}
    />
  );
}
