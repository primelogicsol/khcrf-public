import { redirect } from 'next/navigation';

export default async function MetadataRedirect(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  redirect(`/dashboard/business/publications/add?edit=${params.id}`);
}
