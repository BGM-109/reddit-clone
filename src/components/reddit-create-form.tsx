"use client";
import { redditPostType } from "@/infra/community";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Card } from "@/components/ui/card";

const RedditCreatePostForm = () => {
  const [pending, startTransition] = useTransition();
  const form = useForm<redditPostType>({
    defaultValues: {
      title: "",
      content: "",
    },
  });
  function onSubmit(values: redditPostType) {
    startTransition(() => {
      console.log(values);
    });
  }
  return (
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
                <FormLabel className="text-lg capitalize">Title</FormLabel>

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
                  <TiptapEditor />
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
  );
};

export default RedditCreatePostForm;
