import { PrismaClient, Prisma, Post } from "@prisma/client";
import {
  BasePaginationParams,
  Repository,
  DataWithCount,
} from "@/core/repository";

// Model 영역 입니다.
// Prisma 에서 모델 객체를 가져 옵니다.
export interface PostModel extends Post {
  content: string;
  userName: string;
  voteCount: number;
}
// 프리즈마에서 데이터를 어떻게 가져올지 정의 합니다.
const postSelect = {
  id: true,
  title: true,
  content: true,
  imageUrl: true,
  userId: true,
  subName: true,
  createdAt: true,
  updatedAt: true,
  User: { select: { userName: true } },
  Vote: { select: { userId: true, voteType: true } },
} as const;

// 뷰 영역에서 사용되는 엔티티를 정의 합니다.
export interface PostEntity extends Post {
  content: string;
  userName: string;
  voteCount: number;
}
type PostWithVoteAndUser = Prisma.PostGetPayload<{ select: typeof postSelect }>;

// Prisma 데이터를 Entity로 변환 합니다.
const formatPost = (post: PostWithVoteAndUser): PostEntity => ({
  ...post,
  content: post.content?.toString() ?? "",
  userName: post.User?.userName ?? "Anonymous",
  voteCount: post.Vote.reduce(
    (acc, vote) =>
      vote.voteType === "UP"
        ? acc + 1
        : vote.voteType === "DOWN"
        ? acc - 1
        : acc,
    0
  ),
});

// 레포지토리에서 사용되는 타입들 입니다.

interface FindAllParams extends BasePaginationParams {}
interface FindAllSubParams extends BasePaginationParams {
  subName: string;
}
export type PostCreateModel = Omit<
  PostEntity,
  "id" | "createdAt" | "updatedAt"
>;
export type PostUpdateModel = Partial<PostCreateModel>;

/**
 * Post 레포지토리 입니다.
 */
export class PostRepository
  implements Repository<PostEntity, PostCreateModel, PostUpdateModel>
{
  constructor(private prisma: PrismaClient) {}

  async create(item: PostCreateModel): Promise<PostEntity> {
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
      content: createdPost.content?.toString() ?? "",
      voteCount: 0,
      userName: "",
    };
  }

  async read(id: string): Promise<PostEntity | undefined> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: postSelect,
    });
    return post ? formatPost(post) : undefined;
  }

  async update(
    id: string,
    item: PostUpdateModel
  ): Promise<PostEntity | undefined> {
    try {
      const updatedPost = await this.prisma.post.update({
        where: { id },
        data: item,
        select: postSelect,
      });
      return formatPost(updatedPost);
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

  async findAll(params: FindAllParams): Promise<DataWithCount<PostEntity>> {
    const { page, size } = params;
    const [count, posts] = await this.prisma.$transaction([
      this.prisma.post.count(),
      this.prisma.post.findMany({
        skip: (page - 1) * size,
        take: size,
        select: postSelect,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { data: posts.map(formatPost), count };
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
