export default function Loading() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600"></div>
      <p className="text-lg font-medium text-gray-600">Loading KHCRF Platform...</p>
    </div>
  );
}
