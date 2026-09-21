import type { Metadata } from 'next';
import { ClassificationQueue } from '@/components/skc/classification/ClassificationQueue';

export const metadata: Metadata = {
  title: 'Provenance Classification Queue | SKC Admin',
  description: 'Review and classify records awaiting provenance assignment in the SKC governance system.',
};

export default function SKCClassificationPage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Provenance Classification</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Admin-only governance operation. All changes are recorded in the immutable audit log.
        </p>
      </div>
      <ClassificationQueue />
    </div>
  );
}
