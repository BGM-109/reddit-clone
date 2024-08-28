import SubredditDescriptionForm from "@/components/subreddit-description.form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { CakeIcon, FileQuestion } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getPostSub } from "@/actions/post";
import CreatePostCard from "@/components/create-post-card";
import PostCard from "@/components/post-card";
import Pagination from "@/components/pagination";

type PageProps = {
  params: {
    reddit: string;
  };
  searchParams: {
    page: string;
  };
};

export default async function RedditPage({ params, searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const size = 1;
  const reddit = params.reddit;
  const { data, count } = await getPostSub({
    subName: reddit,
    page,
    size,
  });
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAuthor = user?.id === data?.userId;
  const isLogged = !!user;
  const createPostUrl = isLogged
    ? `/r/${data?.name}/create`
    : "/api/auth/login";

  if (!data) {
    return redirect("/");
  }
  return (
    <div className="max-w-7xl mx-auto flex gap-x-10 mt-4">
      <div className="w-3/4 flex flex-col gap-y-5">
        <CreatePostCard />

        {data?.posts?.length === 0 ? (
          <div className="flex min-h-[300px] flex-col justify-center items-center rounded-md border border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileQuestion className="h-10 w-10 text-primary" />
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              No post have been created
            </h2>
          </div>
        ) : (
          <>
            {data &&
              data.posts.map((post, index) => (
                <PostCard
                  key={index}
                  {...post}
                  content={post.content?.toString() ?? ""}
                  userName={post.userName ?? "Anonymous"}
                  voteCount={post.voteCount ?? 0}
                />
              ))}

            <Pagination totalPages={Math.ceil(count / size)} />
          </>
        )}
      </div>

      <div className="w-1/4">
        <Card>
          <CardHeader className="p-0">
            <CardTitle className="bg-muted p-4 font-semibold m-0">
              About Community
            </CardTitle>
            <CardDescription className="p-4">
              This is a community for developers to share their knowledge and
              help each other.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col">
            <div className="flex items-center gap-x-4">
              <Image
                src={`https://avatar.vercel.sh/janmarshal`}
                width={60}
                height={60}
                alt="Community Avatar"
                className="rounded-full w-16 h-16"
              />
              <p className="font-medium">{`r/${data?.name}`}</p>
            </div>

            {isAuthor ? (
              <SubredditDescriptionForm
                subId={data?.id}
                defaultValues={data?.description ?? ""}
              />
            ) : (
              <p>{data?.description ?? "-"}</p>
            )}

            <div className="flex items-center gap-x-2 mt-2">
              <CakeIcon className="text-mute-foregroun h-5 w-5" />
              <p className="text-muted-foreground font-medium text-sm">
                Created: {/* Example Wendsday , Mar , dd, yyyy */}
                {format(new Date(data?.createdAt), "PPPP")}
              </p>
            </div>

            <Separator className="my-4" />

            <Link
              href={createPostUrl}
              className={cn(
                "",
                buttonVariants({
                  variant: "default",
                  className: "rounded-full w-full",
                })
              )}
            >
              Create Post
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
