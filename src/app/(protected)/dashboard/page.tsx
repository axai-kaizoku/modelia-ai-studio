import { LogoutButton } from "@/components/common/logout-button";
import { auth } from "@/server/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      <LogoutButton />
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
