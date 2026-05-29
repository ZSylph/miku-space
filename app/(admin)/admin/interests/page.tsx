import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { colorMap } from "@/lib/colorMap";
import AdminTable from "@/components/admin/AdminTable";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function InterestsPage() {
  const interests = await prisma.interest.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminTable
      title="兴趣管理"
      createHref="/admin/interests/new"
      createLabel="新建兴趣"
      columns={[
        { key: "title", label: "标题" },
        { key: "icon", label: "图标" },
        { key: "color", label: "颜色" },
        { key: "active", label: "状态" },
        { key: "order", label: "排序" },
        { key: "actions", label: "操作", className: "text-right" },
      ]}
      data={interests}
      emptyColSpan={6}
      emptyMessage="暂无兴趣，点击右上角新建"
      renderRow={(interest) => (
        <tr key={interest.id} className="border-b last:border-0">
          <td className="px-4 py-3 font-medium">{interest.title}</td>
          <td className="px-4 py-3 text-muted-foreground">{interest.icon}</td>
          <td className="px-4 py-3">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[interest.color] || "bg-gray-100 text-gray-700"}`}>
              {interest.color}
            </span>
          </td>
          <td className="px-4 py-3">
            {interest.active ? (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                启用
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                禁用
              </span>
            )}
          </td>
          <td className="px-4 py-3 text-muted-foreground">{interest.order}</td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/admin/interests/${interest.id}/edit`}
                className="text-primary hover:underline"
              >
                编辑
              </Link>
              <DeleteButton
                apiPath={`/api/interests/${interest.id}`}
                itemName="兴趣"
              />
            </div>
          </td>
        </tr>
      )}
    />
  );
}
