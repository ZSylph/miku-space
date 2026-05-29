export default function Loading() {
  return (
    <div className="container py-12">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border p-6 animate-pulse"
          >
            <div className="h-40 bg-muted rounded-md mb-4"></div>
            <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
