import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/getCurrentUser";
import CreateEventPage from "@/features/events/components/CreateEventForm"; // componente cliente

export default async function Page() {
  const user = await getCurrentUser();

  if (!user || !user.roles.includes("event-manager")) {
    redirect("/unauthorized");
  }

  return <CreateEventPage user={user} />;
}
