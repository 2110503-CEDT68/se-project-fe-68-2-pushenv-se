"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/auth/useLogin";
import { jwtDecode } from "jwt-decode";
import type { ApiResponse } from "@/types/api";

const schema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required").regex(/^[\x20-\x7E]+$/, { message: "Only English letters and standard symbols are allowed" }),
  password: z.string().min(1, "Password is required").regex(/^[\x20-\x7E]+$/, { message: "Only English letters and standard symbols are allowed" }),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const form = useForm<FormValues>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  async function onSubmit(values: FormValues) {
    try {
      const data = await loginMutation.mutateAsync(values);
      
      // Decode role and redirect
      const decoded: { role: string } = jwtDecode(data.token);
      const role = decoded.role;

      if (role === "systemAdmin") {
        router.push("/admin/dashboard");
      } else if (role === "companyUser") {
        router.push("/company/dashboard");
      } else {
        router.push("/events");
      }
      
      toast.success("Welcome back!");
    } catch (err: unknown) {
      const errorObj = err as { statusCode?: number; message?: string };
      const message = errorObj?.message || "Login failed";
      toast.error(message === "Invalid credentials" ? "Invalid email or password" : message);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access user, company, and admin accounts from one public entry point.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in…" : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Need an account?{" "}
            <Link href="/signup" className="text-foreground font-medium underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
