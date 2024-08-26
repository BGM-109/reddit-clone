"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { communitySchema, communityType } from "@/infra/community";
import { createCommunity } from "@/actions/community";
import { useRouter } from "next/navigation";

type CommunityFormProps = {};

export default function CommunityForm({}: CommunityFormProps) {
  const [pending, startTransition] = useTransition();
  const { push } = useRouter();
  const { toast } = useToast();
  const form = useForm<communityType>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: communityType) {
    startTransition(() => {
      createCommunity(values).then((result) => {
        if (result?.status === 200) {
          toast({
            title: "Success",
            description: result?.message,
          });
          push("/r/" + values.name);
        } else {
          toast({
            title: "Error",
            description: result?.message,
            variant: "destructive",
          });
        }
      });
    });
  }
  return (
    <Form {...form}>
      <h1 className="text-3xl font-extrabold tracking-tight">
        Create Community
      </h1>
      <Separator className="my-4" />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-stretch w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg capitalize">name</FormLabel>
              <FormDescription>
                Community name must be unique and cant be changed later.
              </FormDescription>
              <FormControl>
                <div className="relative">
                  <p className="absolute left-3  w-8 flex items-center h-full ">
                    r/
                  </p>
                  <Input
                    placeholder="Enter name here"
                    {...field}
                    className="pl-8"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Description</FormLabel>
              <FormDescription>
                This is how new members come to understand your community.
              </FormDescription>
              <FormControl>
                <Input placeholder="Enter description here" {...field} />
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
          {pending ? <Loader2 size={24} className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
