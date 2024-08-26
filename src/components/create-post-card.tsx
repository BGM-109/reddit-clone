import React from "react";
import { Card } from "@/components/ui/card";
import Pfp from "../../public/pfp.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ImageDown, Link2 } from "lucide-react";

const CreatePostCard = () => {
  const href = `/r/crossfit/create`;
  return (
    <Card className="flex  items-center gap-x-3 px-4 py-2">
      <Image src={Pfp} alt="Profile Picture" className="h-12 w-fit" />
      <Link className="w-full" href={href}>
        <Input placeholder="Create Post" />
      </Link>
      <Link
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "icon",
          })
        )}
        href={href}
      >
        <ImageDown className="w-4 h-4" />
      </Link>
      <Link
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "icon",
          })
        )}
        href={href}
      >
        <Link2 className="w-4 h-4" />
      </Link>
    </Card>
  );
};

export default CreatePostCard;
