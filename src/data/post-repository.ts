import { PrismaClient } from "@prisma/client";
import {
  BasePaginationParams,
  Repository,
  DataWithCount,
} from "@/core/repository";

export interface PostModel {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string | null;
  userId?: string | null;
  subName: string | null;
  userName: string;
  voteCount: number;
}

interface FindAllParams extends BasePaginationParams {}
interface FindAllSubParams extends BasePaginationParams {
  subName: string;
}
// add userName, voteCount to PostModel
export type PostCreateModel = Omit<PostModel, "id" | "userName" | "voteCount">;

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
        subName: item.subName,
        imageUrl: item.imageUrl,
      },
    });
    return {
      ...createdPost,
      content: createdPost.content?.toString(),
      voteCount: 0,
      userName: "",
    };
  }

  async read(id: string): Promise<PostModel | undefined> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
        imageUrl: true,
        subName: true,
        User: {
          select: {
            userName: true,
          },
        },
        Vote: {
          select: {
            userId: true,
            voteType: true,
          },
        },
      },
    });
    if (!post) return undefined;
    return {
      ...post,
      id: id,
      content: post.content?.toString(),
      voteCount: post.Vote.reduce((acc, vote) => {
        if (vote.voteType === "UP") return acc + 1;
        if (vote.voteType === "DOWN") return acc - 1;
        return acc;
      }, 0),
      userName: post.User?.userName ?? "Anonymous",
      subName: post.subName,
    };
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
      return {
        ...updatedPost,
        content: updatedPost.content?.toString(),
        voteCount: 0,
        userName: "Anonymous",
      };
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

  async findAll(params: FindAllParams): Promise<DataWithCount<PostModel>> {
    const { page, size } = params;

    const [count, data] = await this.prisma.$transaction([
      this.prisma.post.count(),
      this.prisma.post.findMany({
        skip: (page - 1) * size,
        take: size,
        select: {
          title: true,
          createdAt: true,
          content: true,
          id: true,
          imageUrl: true,
          User: {
            select: {
              userName: true,
            },
          },
          subName: true,
          Vote: {
            select: {
              userId: true,
              voteType: true,
              postId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);
    const formattingData = data.map((post) => ({
      ...post,
      content: post.content?.toString(),
      userName: post.User?.userName ?? "Anonymous",
      voteCount: post.Vote.reduce((acc, vote) => {
        if (vote.voteType === "UP") return acc + 1;
        if (vote.voteType === "DOWN") return acc - 1;
        return acc;
      }, 0),
    }));
    return { data: formattingData, count };
  }

  async findAllSub({ page, size = 1, subName }: FindAllSubParams) {
    const [count, data] = await this.prisma.$transaction([
      this.prisma.post.count({
        where: {
          subName: subName,
        },
      }),
      this.prisma.subreddit.findUnique({
        where: {
          name: subName,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          description: true,
          userId: true,
          posts: {
            skip: (page - 1) * size,
            take: size,
            select: {
              title: true,
              imageUrl: true,
              id: true,
              content: true,
              subName: true,
              Vote: {
                select: {
                  userId: true,
                  voteType: true,
                },
              },
              User: {
                select: {
                  userName: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      }),
    ]);
    const formattingData = data?.posts.map((post) => ({
      ...post,
      content: post.content?.toString(),
      userName: post.User?.userName ?? "Anonymous",
      voteCount: post.Vote.reduce((acc, vote) => {
        if (vote.voteType === "UP") return acc + 1;
        if (vote.voteType === "DOWN") return acc - 1;
        return acc;
      }, 0),
    }));
    const result = {
      id: data?.id ?? "",
      name: data?.name ?? "",
      createdAt: data?.createdAt ?? "-",
      description: data?.description,
      userId: data?.userId,
      posts: formattingData || [],
    };

    return { data: result, count };
  }
}
