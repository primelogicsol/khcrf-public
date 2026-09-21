
import GrantPreviewClient from "../GrantPreviewClient";

export default async function GrantDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <GrantPreviewClient id={params.id} />;
}
