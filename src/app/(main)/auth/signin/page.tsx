'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, UserCircle2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsGoogle } from "react-icons/bs";
import { toast } from "sonner";
import { CustomSession, registerUserOnServer } from "./utils/register_user";

// Shadcn form imports
import SeparatorWithText from "@/components/root/separators/SeparatorWithText";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmailFormValues, emailSchema } from "../schemas/emailSchema";



export default function SignInPage() {
  const { data: session, status } = useSession() as {
    data: CustomSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const router = useRouter();
  const [isRegByEmail, setIsRegByEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  // react-hook-form for Shadcn UI
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    async function handleLogin() {
      if (session?.user) {
        await registerUserOnServer(session);
        toast.success("Login successful!");
        router.push("/");
      }
    }
    if (status === "authenticated") handleLogin();
  }, [session?.user?.email, status, router, session]);

  const onSubmit = async (values: EmailFormValues) => {
    setLoading(true);
    try {
      const result = await signIn("resend", { email: values.email, redirect: false });
      if (result?.error) toast.error(result.error);
      else toast.success(`Magic link sent to ${values.email}`);
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };



  if (session) {
    return (
      <div className="flex justify-center pt-24">
        <Card className="text-center w-full max-w-sm p-6 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-col items-center gap-2">
            <UserCircle2 size={48} className="text-blue-500" />
            <CardTitle>Welcome, {session.user?.name}</CardTitle>
            <CardDescription>{session.user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => signOut()}
              className="w-full mt-4 flex items-center justify-center gap-2"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-24 px-4">
      <Card className="w-full max-w-md p-6 shadow-xl text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-gray-500">
            Access your EPL Predictions Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-4">


          {!isRegByEmail && (
            <>
              <Button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#4285F4] hover:bg-[#357ae8] text-white"
              >
                <BsGoogle size={20} /> Continue with Google
              </Button>
              <SeparatorWithText />
              <Button
                variant="outline"
                onClick={() => setIsRegByEmail(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full"
              >
                <Mail size={20} /> Continue with Email
              </Button>
            </>
          )}

          {isRegByEmail && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription className="text-muted-foreground text-xs mt-1 text-left">
                        We’ll send you a magic link to sign in. No password needed.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-4"
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full rounded-full flex items-center justify-center gap-2 text-gray-500"
                  onClick={() => setIsRegByEmail(false)}
                >
                  <ArrowLeft size={16} /> Back to providers
                </Button>
              </form>
            </Form>
          )}

        </CardContent>
        <CardFooter>
          <CardDescription className="text-gray-400 text-sm">
            We collect zero data about you.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
