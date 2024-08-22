"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { updateCommunity } from "@/actions/community";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

const descriptionSchema = z.object({
  description: z.string().min(5).max(1000),
});

type SubredditDescriptionFormProps = {
  subId: string;
  defaultValues: string;
};

const SubredditDescriptionForm = ({
  subId,
  defaultValues,
}: SubredditDescriptionFormProps) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof descriptionSchema>>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: defaultValues,
    },
  });
  function onSubmit(values: z.infer<typeof descriptionSchema>) {
    const params = {
      subId: subId,
      description: values.description,
    };
    startTransition(() => {
      updateCommunity(params)
        .catch((error) => {
          toast({
            title: "Error",
            description: error?.message,
          });
        })
        .then((result) => {
          if (result?.status === 200) {
            form.reset({
              description: values.description,
            });
          }
        });
    });
  }
  const placeholder = `Create your community description`;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex flex-col"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder={placeholder} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending || !form.formState.isDirty}
          className="self-end"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SubredditDescriptionForm;
