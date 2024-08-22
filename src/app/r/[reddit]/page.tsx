import SubredditDescriptionForm from "@/components/subreddit-description.form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { z } from "zod";

async function getSubReddit(name: string) {
  const data = await prisma.subreddit.findUnique({
    where: {
      name: name,
    },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      userId: true,
    },
  });
  return data;
}

type PageProps = {
  params: {
    reddit: string;
  };
};

export default async function RedditPage({ params }: PageProps) {
  const data = await getSubReddit(params.reddit);
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAuthor = user?.id === data?.userId;

  if (!data) {
    return redirect("/");
  }
  return (
    <div className="max-w-7xl mx-auto flex gap-x-10 mt-4">
      <div className="w-3/5">
        <h1>This is post section</h1>
      </div>

      <div className="w-2/5">
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
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
