import DisclaimersClient from "@/components/admin/DisclaimersClient";
import { getAllDisclaimers } from "@/app/actions/disclaimers";

export const dynamic = "force-dynamic";

export default async function AdminDisclaimersPage() {
  const disclaimers = await getAllDisclaimers();

  return <DisclaimersClient initialDisclaimers={disclaimers} />;
}
