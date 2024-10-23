"use client"

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation";

import { cn } from "@onyx/ui/lib/utils"
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  buttonVariants,
  Input,
  Label,
  toast,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@onyx/ui"
import Icons from "@onyx/ui/icons"

import { createPlatform, updatePlatform } from "@onyx/neurons/bugbounty/actions/platform";

const formSchema = z.object({
  platform: z.string(),
  email: z.string(),
  password: z.string(),
  otp: z.string().optional().or(z.literal(''))
});

type FormData = z.infer<typeof formSchema>;

interface PlatformFormProps {
  initialData: any | null;
}

export function PlatformForm({ initialData }: PlatformFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const title = initialData ? "Edit platform" : "Add a platform";
  const description = initialData ? "Edit a platform." : "Add a new platform";
  const toastMessage = initialData ? "Platform updated." : "Platform added.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? initialData
    : {
        platform: "yeswehack",
      };

  const {
    handleSubmit,
    register,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const platform = watch("platform");

  const onSubmit = handleSubmit(data => {
    startTransition(async () => {
      try {
        if (initialData) {
          await updatePlatform(initialData.id, data);
        } else {
          await createPlatform(data);
        }

        toast({
          description: toastMessage,
        })
        router.push(`/dashboard/neuron/bugbounty/platform`);
      } catch (error) {
        toast({
          title: "Error",
          description: "There was a problem updating the platform.",
          variant: "destructive",
        })
      }
    });
  });

  const tryCredentials = () => {
    startTransition(async () => {
      try {
        const currentFormValues = getValues();
        const response = await fetch(`/api/neuron/bugbounty/platform/try`, {
          method: "POST",
          body: JSON.stringify(currentFormValues),
        });
        const data = await response.json();
        if (data.message === "valid credentials") {
          toast({
            description: "Credentials are valid.",
          });
        } else {
          toast({
            title: "Error",
            description: "Credentials are invalid.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "There was a problem checking the credentials.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yeswehack">YesWeHack</SelectItem>
                      <SelectItem value="hackerone">Hackerone</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.platform && (
                <p className="px-1 text-xs text-red-600">{errors.platform.message}</p>
              )}
            </div>

            {platform === "yeswehack" && (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <p className="px-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="otp">TOTP Code</Label>
                  <Input
                    id="otp"
                    placeholder="TOTP Code"
                    {...register("otp")}
                  />
                  {errors?.otp && (
                    <p className="px-1 text-xs text-red-600">{errors.otp.message}</p>
                  )}
                </div>
              </>
            )}

            {platform === "hackerone" && (
              <>
                <div>
                  <Label htmlFor="email">Username</Label>
                  <Input
                    id="email"
                    placeholder="Hackerone Username"
                    {...register("email")}
                  />
                  {errors?.email && (
                    <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">API Key</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Api Key"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <p className="px-1 text-xs text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            onClick={tryCredentials}
            className={cn(buttonVariants({ variant: "outline" }))}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>Try Credentials</span>
          </Button>
          <Button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>{isPending ? "Saving..." : action}</span>
          </Button>
        </CardFooter>
    </form>
  )
}