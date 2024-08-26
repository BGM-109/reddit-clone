"use server";

import { usernameFormType } from "@/infra/user";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export async function updateUsername(
  values: usernameFormType
): Promise<ActionResult> {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login");
  }

  const username = values.username;

  try {
    // Update the username in the database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        userName: username,
      },
    });

    return {
      status: 200,
      message: "Username updated successfully",
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          status: 400,
          message: "Username already exists",
        };
      }
    }
    return {
      status: 400,
      message: "Internal server error",
    };
  }
}
