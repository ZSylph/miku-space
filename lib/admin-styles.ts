import { cn } from "@/lib/utils";

export const adminInputClass = cn(
  "w-full rounded-xl border px-3.5 py-2.5 text-sm",
  "bg-[rgba(168,230,225,0.06)] border-[rgba(168,230,225,0.2)]",
  "placeholder:text-muted-foreground/50",
  "focus:outline-none focus:ring-2 focus:ring-miku-primary/30 focus:border-miku-primary/40",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.1)]"
);

export const adminLabelClass = "block text-sm font-medium mb-2 text-foreground";

export const adminPrimaryButton = cn(
  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium",
  "bg-miku-primary text-primary-foreground",
  "hover:bg-miku-primary-dark disabled:opacity-50 transition-colors"
);

export const adminSecondaryButton = cn(
  "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium",
  "border border-[rgba(168,230,225,0.3)]",
  "hover:bg-[rgba(168,230,225,0.1)] transition-colors",
  "dark:border-[rgba(255,255,255,0.1)] dark:hover:bg-[rgba(255,255,255,0.04)]"
);

export const adminCheckboxClass =
  "w-4 h-4 rounded border border-[rgba(168,230,225,0.3)] accent-miku-primary-dark";

export const adminCardBase = cn(
  "rounded-2xl backdrop-blur-xl border",
  "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.07)]"
);
