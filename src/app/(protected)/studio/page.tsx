import { auth } from "@/server/auth";
import StudioPage from "./_components/studio";

export default async function Page() {
  const session = await auth();
  return (
    <div>
      {/* <LogoutButton /> */}
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <StudioPage userEmail={session?.user?.email ?? ""} />
    </div>
  );
}
