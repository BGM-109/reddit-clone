import { PostModel } from "@/data/post-repository";
import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface IPostCardProps extends PostModel {
  userName: string;
}

const PostCard = ({
  id,
  imageUrl,
  content,
  subName,
  title,
  userName,
}: IPostCardProps) => {
  return (
    <Card className="flex relative overflow-hidden">
      <div className="flex flex-col items-center gap-y-2 bg-muted p-2">
        <Button variant={"outline"} size={"sm"}>
          <ArrowUp className="w-4 h-4 " />
        </Button>

        {0}
        <Button variant={"outline"} size={"sm"}>
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <div className="flex items-center gap-x-2 p-2">
          <Link className="font-semibold text-xs" href={`/r/${subName}`}>
            r/{subName}
          </Link>
          <p className="text-xs text-muted-foreground">
            Posted by: <span className="hover:text-primary">u/{userName}</span>
          </p>
        </div>

        <div className="px-2">
          <Link href={`/post/${id}`}>
            <h1 className="font-medium mt-1 text-lg">{title}</h1>
          </Link>
        </div>

        <div className="max-h-[300px] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Post Image"
              width={600}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            // <RenderToJson data={jsonContent} /><>
            <></>
          )}
        </div>

        <div className="m-3 flex items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground font-medium text-xs">
              {/* {commentAmount} Comments */}
            </p>
          </div>

          {/* <CopyLink id={id} /> */}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
