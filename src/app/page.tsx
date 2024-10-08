import { getPosts } from "@/actions/post";
import DefaultLayout from "@/components/layout/default-layout";
import PostCard from "@/components/post-card";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import HelloImage from "../../public/hero-image.png";
import Banner from "../../public/banner.png";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CreatePostCard from "@/components/create-post-card";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import { SuspenseCard } from "@/components/suspense-card";

type PageParams = {
  searchParams: {
    page: string;
  };
};

export default async function Home({ searchParams }: PageParams) {
  const page = Number(searchParams.page) || 1;
  const size = 1;
  const { count, data } = await getPosts({
    page,
    size: size,
  });

  return (
    <DefaultLayout>
      <div className="w-3/4 space-y-4">
        <CreatePostCard />
        <Suspense fallback={<SuspenseCard />} key={page}>
          {data &&
            data.map((post, index) => (
              <PostCard
                key={index}
                {...post}
                content={post.content?.toString() ?? ""}
                userName={post.userName ?? "Anonymous"}
                voteCount={post.voteCount ?? 0}
              />
            ))}

          <Pagination totalPages={Math.ceil(count / size)} />
        </Suspense>
      </div>
      <div className="w-1/4">
        <Card>
          <Image src={Banner} alt="banner" />
          <div className="p-3">
            <div className="flex items-center">
              <Image src={HelloImage} alt="hello" className="w-10 h-16 -mt-6" />
              <h1 className="font-medium pl-2">Home</h1>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Your Home Reddit frontpage. Come here to check in with your
              favorite communities!
            </p>
            <Separator className="my-4" />
            <div className="flex flex-col gap-y-3">
              <Link
                className={cn(buttonVariants({ variant: "secondary" }), "px-0")}
                href="/r/crossfit/create"
              >
                Create Post
              </Link>
              <Link
                className={cn(buttonVariants({ variant: "default" }), "px-0")}
                href="/r/create"
              >
                Create Community
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
}
