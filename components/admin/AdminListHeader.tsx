import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminCardBase } from "@/components/admin/styles";

interface AdminListHeaderProps {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
  extraActions?: React.ReactNode;
}

export default function AdminListHeader({
  icon,
  iconClassName = "bg-primary/10 dark:bg-primary/15",
  title,
  subtitle,
  actionHref,
  actionLabel,
  extraActions,
}: AdminListHeaderProps) {
  return (
    <div className={cn(adminCardBase, "p-5")}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconClassName)}>
            {icon}
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {extraActions}
          <Link
            href={actionHref}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium",
              "bg-miku-primary text-primary-foreground",
              "hover:bg-miku-primary-dark transition-colors"
            )}
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
