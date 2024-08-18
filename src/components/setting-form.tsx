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
import { updateUsername } from "@/actions/update-username";
import { usernameFormSchema, usernameFormType } from "@/infra/user";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type SettingFormProps = {
  initialValues: usernameFormType;
};

export default function SettingForm({ initialValues }: SettingFormProps) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<usernameFormType>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: initialValues,
  });

  function onSubmit(values: usernameFormType) {
    startTransition(() => {
      updateUsername(values)
        .catch((error) => {
          toast({
            title: "Error",
            description: error?.message,
          });
        })
        .then((result) => {
          if (result?.status === 200) {
            toast({
              title: "Success",
              description: result?.message,
            });

            form.reset({
              username: values.username,
            });
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
      <h1 className="text-3xl font-extrabold tracking-tight">Setting</h1>
      <Separator className="my-4" />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-stretch w-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Username</FormLabel>
              <FormDescription>
                In this Setting, you can change your username.
              </FormDescription>
              <FormControl>
                <Input placeholder="Enter ur username" {...field} />
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
