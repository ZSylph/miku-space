"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseAdminSubmitOptions {
  apiPath: string;
  redirectPath: string;
  method?: "POST" | "PUT";
}

export function useAdminSubmit({
  apiPath,
  redirectPath,
  method = "POST",
}: UseAdminSubmitOptions) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(data: Record<string, unknown>) {
    setLoading(true);
    setError("");

    const res = await fetch(apiPath, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push(redirectPath);
      router.refresh();
    } else {
      const result = await res.json().catch(() => ({}));
      setError(result.error || "操作失败");
    }
  }

  return { loading, error, setError, submit };
}
