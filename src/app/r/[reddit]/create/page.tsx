"use client";
import DefaultLayout from "@/components/layout/default-layout";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import pfp from "../../../../../public/pfp.png";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextIcon, VideoIcon } from "lucide-react";
import RedditCreatePostForm from "@/components/reddit-create-form";
import { UploadDropzone } from "@/lib/uploadthing";
import MediaUploadForm from "@/components/media-upload-form";

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
  const tabs = ["post", "media"];
  const tabText = (tab: string) => {
    switch (tab) {
      case "post":
        return "Post";
      case "media":
        return "Image & Video";
    }
  };
  const tabIcon = (tab: string) => {
    switch (tab) {
      case "post":
        return <TextIcon size={16} className="mr-2" />;
      case "media":
        return <VideoIcon size={16} className="mr-2" />;
    }
  };
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
        <Tabs defaultValue={tabs[0]} className="w-full">
          <TabsList className="w-full flex">
            {tabs.map((tab, index) => (
              <TabsTrigger
                value={tab}
                className="basis-1/2 w-full space-x-3"
                key={index}
              >
                {tabIcon(tab)}
                {tabText(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={tabs[0]} className="w-full">
            <RedditCreatePostForm />
          </TabsContent>
          <TabsContent value={tabs[1]} className="w-full">
            <MediaUploadForm />
          </TabsContent>
        </Tabs>
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
