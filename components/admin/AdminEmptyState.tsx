import Link from "next/link";
import { cn } from "@/lib/utils";
import { adminCardBase } from "@/lib/admin-styles";

interface AdminEmptyStateProps {
  icon: React.ReactNode;
  message: string;
  actionHref: string;
  actionLabel: string;
}

export default function AdminEmptyState({
  icon,
  message,
  actionHref,
  actionLabel,
}: AdminEmptyStateProps) {
  return (
    <div className={cn(adminCardBase, "p-12 text-center")}>
      <div className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3">{icon}</div>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Link
        href={actionHref}
        className="text-sm text-miku-primary-dark hover:underline"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
