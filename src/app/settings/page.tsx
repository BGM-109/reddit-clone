import SettingForm from "@/components/setting-form";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userName: true,
    },
  });

  return data;
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login");
  }
  const data = await getData(user?.id);

  return (
    <div className="max-w-6xl mx-auto flex flex-col mt-4">
      <SettingForm initialValues={{ username: data?.userName ?? "" }} />
    </div>
  );
}
