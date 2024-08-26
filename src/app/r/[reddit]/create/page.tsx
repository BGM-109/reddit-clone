import DefaultLayout from "@/components/layout/default-layout";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import pfp from "../../../../../public/pfp.png";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import RedditCreatePostForm from "@/components/reddit-create-form";

const rules = [
  {
    id: 1,
    text: "Remember the human",
  },
  {
    id: 2,
    text: "Behave like you would in real life",
  },
  {
    id: 3,
    text: "Look for the original source of content",
  },
  {
    id: 4,
    text: "Search for duplicates before posting",
  },
  {
    id: 5,
    text: "Read the community’s rules",
  },
];

type PageParams = {
  params: {
    reddit: string;
  };
};

/**
 * Showing the create post page
 * 1. Right side of the page is a card that contains the rules of posting to Reddit
 * 2. Left side of the page is a form to create a post
 */
export default function CreatePostPage({ params }: PageParams) {
  const { reddit } = params;

  return (
    <DefaultLayout>
      <div className="w-3/5">
        <p className="font-semibold">
          {`SubReddit: `}
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "px-0 font-semibold"
            )}
            href={`/r/${reddit}`}
          >
            {`r/${reddit}`}
          </Link>
        </p>
        <RedditCreatePostForm />
      </div>
      <div className="w-2/5">
        <Card className="flex flex-col p-4">
          <div className="flex items-center space-x-2">
            <Image src={pfp} alt="pfp" className="w-10 h-14" />
            <h1 className="font-medium">Posting to Reddit</h1>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-y-5">
            {rules.map((rule) => (
              <div key={rule.id} className="">
                <p className="text-sm font-medium">{`${rule.id}. ${rule.text}`}</p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
}
