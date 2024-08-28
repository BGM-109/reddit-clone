import { PrismaClient } from "@prisma/client";
import { Repository } from "@/core/repository";

export interface PostModel {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string | null;
  userId?: string | null;
  subName: string | null;
}

export type PostCreateModel = Omit<PostModel, "id">;

export class PostRepository implements Repository<PostModel> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(item: PostCreateModel): Promise<PostModel> {
    const createdPost = await this.prisma.post.create({
      data: {
        title: item.title,
        content: item.content,
        userId: item.userId,
      },
    });
    return {
      ...createdPost,
      content: createdPost.content?.toString(),
    };
  }

  async read(id: string): Promise<PostModel | undefined> {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) return undefined;
    return { ...post, content: post.content?.toString() };
  }

  async update(id: string, item: PostModel): Promise<PostModel | undefined> {
    try {
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: {
          title: item.title,
          content: item.content,
          userId: item.userId,
        },
      });
      return { ...updatedPost, content: updatedPost.content?.toString() };
    } catch (error) {
      return undefined;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findAll(): Promise<PostModel[]> {
    const posts = await this.prisma.post.findMany({});
    return posts.map((post) => ({
      ...post,
      content: post.content?.toString(),
    }));
  }
}
