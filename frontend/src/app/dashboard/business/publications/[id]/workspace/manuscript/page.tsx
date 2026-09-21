import { redirect } from 'next/navigation';

export default async function ManuscriptRedirect(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Redirect to the Content Studio with the publication pre-selected
  redirect(`/dashboard/business/publications/content-studio?publicationId=${params.id}`);
}
