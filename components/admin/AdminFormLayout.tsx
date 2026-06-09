"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, AlertCircle, X } from "lucide-react";

interface AdminFormLayoutProps {
  title: string;
  breadcrumb: { label: string; href: string };
  children: ReactNode;
  error?: string;
  onDismissError?: () => void;
}

export default function AdminFormLayout({
  title,
  breadcrumb,
  children,
  error,
  onDismissError,
}: AdminFormLayoutProps) {
  const cardBase = cn(
    "rounded-2xl backdrop-blur-xl border",
    "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)]",
    "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.07)]",
  );

  return (
    <div className="space-y-3">
      {/* Header with breadcrumb */}
      <div className={cn(cardBase, "px-5 py-3")}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link
            href={breadcrumb.href}
            className="hover:text-foreground transition-colors"
          >
            {breadcrumb.label}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-4 py-2.5",
            "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400",
          )}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm flex-1">{error}</span>
          {onDismissError && (
            <button
              onClick={onDismissError}
              className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <div className={cn(cardBase, "p-4 md:p-5 w-full")}>{children}</div>
    </div>
  );
}
