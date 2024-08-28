"use client";
import { redditPostSchema, redditPostType } from "@/infra/community";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, TextIcon, VideoIcon } from "lucide-react";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { createPost } from "@/actions/post";
import { useParams } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
const RenderCounter = () => {
  const renders = React.useRef(0);
  console.log("Render count:", ++renders.current);
  return null;
};

const RedditCreatePostForm = () => {
  const params = useParams();
  const subName = params.reddit as string;
  const { toast } = useToast();
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
  const [pending, startTransition] = useTransition();
  const form = useForm<redditPostType>({
    mode: "onChange",
    resolver: zodResolver(redditPostSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: undefined,
    },
  });
  function onSubmit(values: redditPostType) {
    console.log("On submit Executed");
    // startTransition(() => {
    //   createPost({
    //     title: values.title,
    //     jsonContent: values.content,
    //     imageUrl: values.imageUrl,
    //     subName: subName,
    //   }).then((res) => {
    //     // if (res?.status === 400) {
    //     //   toast({
    //     //     title: "Error",
    //     //     description: res?.message,
    //     //     variant: "destructive",
    //     //   });
    //     //   return;
    //     // }
    //     toast({
    //       title: "Success",
    //       description: "Post created",
    //     });
    //   });
    // });
  }
  return (
    <>
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
          <Card className="p-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 flex flex-col items-stretch w-full"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg capitalize">
                        Title
                      </FormLabel>

                      <FormControl>
                        <Input placeholder="Enter title here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TiptapEditor
                          json={field.value}
                          setJson={(json) => field.onChange(json)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={!form.formState.isDirty}
                  type="submit"
                  className="self-end"
                >
                  {pending ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value={tabs[1]} className="w-full">
          <Card className="p-4">
            {form.watch("imageUrl") === undefined ? (
              <UploadDropzone
                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-label:text-primary ut-button:ut-uploading:bg-primary/50 ut-button:ut-uploading:after:bg-primary"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  form.setValue("imageUrl", res[0].url);
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  });
                }}
              />
            ) : (
              <Image
                src={form.watch("imageUrl")!}
                alt="preview"
                width={500}
                height={400}
                className="h-80 rounded-lg w-full object-contain"
              />
            )}
          </Card>
        </TabsContent>
      </Tabs>
      <RenderCounter />
    </>
  );
};

export default RedditCreatePostForm;
