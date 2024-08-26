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

  try {
    const data = await repository.create({
      title,
      content: jsonContent,
      imageUrl,
      userId: user.id,
      subName,
    });

    return redirect(`/post/${data.id}`);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          status: 400,
          message: "Post already exists",
        };
      }
      if (e.code === "P2003") {
        return {
          status: 400,
          message: "User not found",
        };
      }
    }
    return {
      status: 400,
      message: "Internal server error",
    };
  }
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

export async function getPosts() {
  try {
    const posts = await repository.findAll();
    return posts;
  } catch (e) {
    return {
      status: 400,
      message: "Internal server error",
    };
  }
}
