import CcsiClient from "./CcsiClient";

export const metadata = {
  title: "CCSI Profiles Management | Dashboard",
  description: "View and manage all CCSI profiles across legislative offices",
};

export default function CcsiAdminPage() {
  return <CcsiClient />;
}
