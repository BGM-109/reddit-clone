"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TypeOfVote } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface HandleVoteParams {
  pid: string;
  voteType: TypeOfVote;
}

export async function handleVote({ pid, voteType }: HandleVoteParams) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const vote = await prisma.vote.findFirst({
    where: {
      postId: pid,
      userId: user.id,
    },
  });
  if (vote) {
    if (vote.voteType === voteType) {
      await prisma.vote.delete({
        where: {
          id: vote.id,
        },
      });

      return revalidatePath("/", "page");
    } else {
      await prisma.vote.update({
        where: {
          id: vote.id,
        },
        data: {
          voteType,
        },
      });
      return revalidatePath("/", "page");
    }
  }

  await prisma.vote.create({
    data: {
      voteType: voteType,
      userId: user.id,
      postId: pid,
    },
  });

  return revalidatePath("/", "page");
}
