import { getPosts } from "@/actions/post";
import DefaultLayout from "@/components/layout/default-layout";
import PostCard from "@/components/post-card";
import { PostModel } from "@/data/post-repository";
import prisma from "@/lib/db";
import { unstable_noStore } from "next/cache";

async function getData(searchParam: string) {
  unstable_noStore();
  const [count, data] = await prisma.$transaction([
    prisma.post.count(),
    prisma.post.findMany({
      take: 10,
      skip: searchParam ? (Number(searchParam) - 1) * 10 : 0,
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

  return { data, count };
}
type PageParams = {
  searchParam: string;
};

export default async function Home({ searchParam }: PageParams) {
  const posts = await getData(searchParam);
  return (
    <DefaultLayout>
      <div className="w-3/5">
        {posts &&
          posts.data.map((post, index) => (
            <PostCard
              key={index}
              {...post}
              content={post.content?.toString() ?? ""}
              userName={post.User?.userName ?? "Anonymous"}
            />
          ))}
      </div>
      <div className="w-2/5">Right side</div>
    </DefaultLayout>
  );
}
