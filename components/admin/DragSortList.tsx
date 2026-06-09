"use client";

import { useState, useRef, useCallback, useMemo, Children } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DragItem {
  id: string;
  order: number;
}

interface DragSortListProps<T extends DragItem> {
  items: T[];
  children: React.ReactNode[];
  reorderApi: string;
  className?: string;
}

const cardBase = cn(
  "rounded-2xl backdrop-blur-xl border",
  "bg-[rgba(255,255,255,0.65)] border-[rgba(168,230,225,0.2)]",
  "dark:bg-[rgba(255,255,255,0.04)] dark:border-[rgba(255,255,255,0.07)]",
);

export default function DragSortList<T extends DragItem>({
  items: initialItems,
  children,
  reorderApi,
  className,
}: DragSortListProps<T>) {
  const router = useRouter();
  const [orderIds, setOrderIds] = useState(() =>
    initialItems.map((item) => item.id),
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dragCounter = useRef(new Map<string, number>());

  const itemMap = useMemo(
    () => new Map(initialItems.map((item) => [item.id, item] as const)),
    [initialItems],
  );
  const visibleItems = useMemo(() => {
    const currentIds = new Set(initialItems.map((item) => item.id));
    const orderedIds = orderIds.filter((id) => currentIds.has(id));
    const nextIds = initialItems
      .map((item) => item.id)
      .filter((id) => !orderedIds.includes(id));
    return [...orderedIds, ...nextIds]
      .map((id) => itemMap.get(id))
      .filter((item): item is T => Boolean(item));
  }, [initialItems, itemMap, orderIds]);

  // Build a stable id -> child mapping from props on every render
  const childArray = Children.toArray(children);
  const childMap = useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    initialItems.forEach((item, i) => {
      map.set(item.id, childArray[i]);
    });
    return map;
  }, [childArray, initialItems]);

  const persistOrder = useCallback(
    async (reordered: T[]) => {
      setSaving(true);
      const orders = reordered.map((item, i) => ({ id: item.id, order: i }));
      try {
        const res = await fetch(reorderApi, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orders }),
        });
        if (!res.ok) {
          console.error("Reorder failed");
          router.refresh();
        }
      } catch {
        console.error("Reorder request error");
        router.refresh();
      } finally {
        setSaving(false);
      }
    },
    [reorderApi, router],
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string) => {
      setDragId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    [],
  );

  const handleDragEnter = useCallback((id: string) => {
    setOverId(id);
    const count = dragCounter.current.get(id) ?? 0;
    dragCounter.current.set(id, count + 1);
  }, []);

  const handleDragLeave = useCallback((id: string) => {
    const count = (dragCounter.current.get(id) ?? 1) - 1;
    dragCounter.current.set(id, count);
    if (count <= 0) {
      dragCounter.current.delete(id);
      setOverId((prev) => (prev === id ? null : prev));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetId) {
        setDragId(null);
        setOverId(null);
        dragCounter.current.clear();
        return;
      }

      const sourceIndex = orderIds.indexOf(sourceId);
      const targetIndex = orderIds.indexOf(targetId);
      if (sourceIndex < 0 || targetIndex < 0) {
        setDragId(null);
        setOverId(null);
        dragCounter.current.clear();
        return;
      }

      const nextIds = [...orderIds];
      const [movedId] = nextIds.splice(sourceIndex, 1);
      nextIds.splice(targetIndex, 0, movedId);
      setOrderIds(nextIds);

      const reordered = nextIds
        .map((id) => itemMap.get(id))
        .filter((item): item is T => Boolean(item));
      persistOrder(reordered);

      setDragId(null);
      setOverId(null);
      dragCounter.current.clear();
    },
    [itemMap, orderIds, persistOrder],
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
    setOverId(null);
    dragCounter.current.clear();
  }, []);

  return (
    <div className={cn("grid gap-2", className)}>
      {visibleItems.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragEnter={() => handleDragEnter(item.id)}
          onDragLeave={() => handleDragLeave(item.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
          onDragEnd={handleDragEnd}
          className={cn(
            cardBase,
            "p-4 group transition-all duration-200",
            dragId === item.id && "opacity-40 scale-[0.98]",
            overId === item.id &&
              dragId !== item.id &&
              "ring-2 ring-miku-primary/40 -translate-y-0.5",
            dragId !== item.id && "hover:-translate-y-0.5",
          )}
          style={{ cursor: "grab" }}
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center pt-1 shrink-0 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">{childMap.get(item.id)}</div>
          </div>
        </div>
      ))}

      {saving && (
        <p className="text-center text-xs text-muted-foreground/50 py-1">
          排序保存中...
        </p>
      )}
    </div>
  );
}
