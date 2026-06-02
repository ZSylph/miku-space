"use client";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-[rgba(245,198,208,0.15)] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#F5C6D0]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          出了点问题
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          页面加载时发生了意外错误，请稍后重试。
        </p>
        <button
          onClick={reset}
          className={[
            "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium",
            "bg-[rgba(168,230,225,0.15)] text-miku-primary",
            "hover:bg-[rgba(168,230,225,0.28)] transition-colors",
          ].join(" ")}
        >
          重试
        </button>
      </div>
    </div>
  );
}
