import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative z-10 min-h-[60vh] flex items-center justify-center px-6">
      <div
        className={[
          "max-w-md w-full rounded-[24px] backdrop-blur-xl p-8 text-center",
          "bg-[rgba(255,255,255,0.9)] border border-[rgba(168,230,225,0.3)]",
          "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
          "dark:bg-[rgba(255,255,255,0.08)] dark:border-[rgba(255,255,255,0.12)]",
          "dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)]",
        ].join(" ")}
      >
        <p className="text-6xl font-bold text-gradient mb-4">404</p>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          页面未找到
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          你访问的页面不存在或已被移除。
        </p>
        <Link
          href="/"
          className={[
            "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium",
            "bg-[rgba(168,230,225,0.15)] text-miku-primary",
            "hover:bg-[rgba(168,230,225,0.28)] transition-colors",
          ].join(" ")}
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
