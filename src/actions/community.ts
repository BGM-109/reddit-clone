"use server";

import { communityType } from "@/infra/community";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createCommunity({
  name,
  description,
}: communityType): Promise<ActionResult> {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login");
  }

  try {
    await prisma.subreddit.create({
      data: {
        name,
        description,
        userId: user.id,
      },
    });

    return {
      status: 200,
      message: "Community created successfully",
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          status: 400,
          message: "Community already exists",
        };
      }
    }
    return {
      status: 400,
      message: "Internal server error",
    };
  }
}
