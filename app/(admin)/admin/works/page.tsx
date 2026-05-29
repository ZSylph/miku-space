import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminTable from "@/components/admin/AdminTable";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminTable
      title="作品管理"
      createHref="/admin/works/new"
      createLabel="新建作品"
      columns={[
        { key: "title", label: "标题" },
        { key: "slug", label: "Slug" },
        { key: "featured", label: "精选" },
        { key: "order", label: "排序" },
        { key: "actions", label: "操作", className: "text-right" },
      ]}
      data={works}
      emptyColSpan={5}
      emptyMessage="暂无作品，点击右上角新建"
      renderRow={(work) => (
        <tr key={work.id} className="border-b last:border-0">
          <td className="px-4 py-3 font-medium">{work.title}</td>
          <td className="px-4 py-3 text-muted-foreground">{work.slug}</td>
          <td className="px-4 py-3">
            {work.featured ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                精选
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                普通
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-muted-foreground">{work.order}</td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/admin/works/${work.id}/edit`}
                className="text-primary hover:underline"
              >
                编辑
              </Link>
              <DeleteButton
                apiPath={`/api/works/${work.id}`}
                itemName="作品"
              />
            </div>
          </td>
        </tr>
      )}
    />
  );
}
