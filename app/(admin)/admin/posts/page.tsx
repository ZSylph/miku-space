import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminTable from "@/components/admin/AdminTable";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminTable
      title="文章管理"
      createHref="/admin/posts/new"
      createLabel="新建文章"
      columns={[
        { key: "title", label: "标题" },
        { key: "slug", label: "Slug" },
        { key: "published", label: "状态" },
        { key: "createdAt", label: "创建时间" },
        { key: "actions", label: "操作", className: "text-right" },
      ]}
      data={posts}
      emptyColSpan={5}
      emptyMessage="暂无文章，点击右上角新建"
      renderRow={(post) => (
        <tr key={post.id} className="border-b last:border-0">
          <td className="px-4 py-3 font-medium">{post.title}</td>
          <td className="px-4 py-3 text-muted-foreground">{post.slug}</td>
          <td className="px-4 py-3">
            {post.published ? (
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
            {new Date(post.createdAt).toLocaleDateString("zh-CN")}
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-primary hover:underline"
              >
                编辑
              </Link>
              <DeleteButton
                apiPath={`/api/posts/${post.id}`}
                itemName="文章"
              />
            </div>
          </td>
        </tr>
      )}
    />
  );
}
