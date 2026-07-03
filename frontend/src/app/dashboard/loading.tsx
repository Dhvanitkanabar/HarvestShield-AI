export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded-xl w-64" />
        <div className="h-4 bg-slate-100 rounded-lg w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-8 bg-slate-200 rounded w-16" />
            <div className="h-3 bg-slate-100 rounded w-32" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="h-5 bg-slate-200 rounded w-48 mb-4" />
        <div className="h-[300px] bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
