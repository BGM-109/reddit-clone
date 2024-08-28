"use server";

import { PostRepository } from "@/data/post-repository";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

const repository = new PostRepository(prisma);

export async function createPost({
  title,
  subName,
  imageUrl,
  jsonContent,
}: {
  title: string;
  subName: string;
  imageUrl?: string;
  jsonContent?: string;
}) {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }
  const data = await repository.create({
    title,
    content: jsonContent,
    imageUrl,
    userId: user.id,
    subName,
  });
  return redirect(`/post/${data.id}`);
}

export async function getPostById({ id }: { id: string }) {
  try {
    const post = await repository.read(id);
    return post;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          status: 400,
          message: "Post not found",
        };
      }
    }
    return {
      status: 400,
      message: "Internal server error",
    };
  }
}

type GetPostsParams = {
  page: number;
  size?: number;
};

export async function getPosts({ page, size = 1 }: GetPostsParams) {
  const { data, count } = await repository.findAll({ page, size });
  return { data, count };
}

type GetPostsBySubParams = GetPostsParams & {
  subName: string;
};

export async function getPostSub({
  page,
  size = 1,
  subName,
}: GetPostsBySubParams) {
  const { data, count } = await repository.findAllSub({ page, size, subName });
  return { data, count };
}
