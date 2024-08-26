"use client";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

const CopyLink = ({ id }: { id?: string }) => {
  async function copyToClipboard() {
    if (!id) return;
    try {
      const url = `${location.origin}/post/${id}`;
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }
  return (
    <Button variant="ghost" onClick={copyToClipboard}>
      <Share className="w-4 h-4 text-muted-foreground mr-2" />
      <p className="text-muted-foreground font-medium text-xs">Share</p>
    </Button>
  );
};

export default CopyLink;
