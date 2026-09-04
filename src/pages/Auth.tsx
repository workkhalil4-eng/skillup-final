import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function Auth({ type = "login" }: { type?: "login" | "register" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailConfirmSent, setEmailConfirmSent] = useState(false);
  const { session } = useAuth();
  const { t } = useTranslation();
  const isLogin = type === "login";

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: { data: { full_name: data.fullName } },
        });
        if (error) throw error;
        // If email confirmation required (session is null after signup)
        if (!signUpData.session) {
          setEmailConfirmSent(true);
          return;
        }
      }
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Email confirmation sent screen
  if (emailConfirmSent) {
    return (
      <div className="container flex h-[calc(100vh-80px)] w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] text-center">
          <div className="text-6xl mb-2">📧</div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            {t("auth.confirmEmailTitle")}
          </h1>
          <p className="text-muted-foreground">{t("auth.confirmEmailHint")}</p>
          <Button variant="outline" asChild>
            <Link to="/login">{t("nav.login")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-[calc(100vh-80px)] w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? t("auth.signInHint") : t("auth.signUpHint")}
          </p>
        </div>

        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {authError && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md" role="alert">
                  {authError}
                </div>
              )}

              {!isLogin && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.fullName")}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
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
                    <FormLabel>{t("auth.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden="true" />
                )}
                {isLogin ? t("auth.signIn") : t("auth.signUp")}
              </Button>
            </form>
          </Form>
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                {t("auth.signUp")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.hasAccount")}{" "}
              <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                {t("auth.signIn")}
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
