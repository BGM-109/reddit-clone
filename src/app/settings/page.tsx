import ProtectedRoute from "@/auth/protected";
import SettingForm from "@/components/setting-form";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getUsername() {
  // prevent unauthorized access area
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login?post_login_redirect_url=/settings");
  }

  const data = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      userName: true,
    },
  });

  return data;
}

export default async function SettingsPage() {
  const data = await getUsername();
  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto flex flex-col mt-4">
        <SettingForm initialValues={{ username: data?.userName ?? "" }} />
      </div>
    </ProtectedRoute>
  );
}
