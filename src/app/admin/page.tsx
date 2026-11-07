import { redirect } from "next/navigation";
import { ROUTES } from "@/src/constants";

export default function AdminPage() {
  redirect(ROUTES.adminDashboard);
}
