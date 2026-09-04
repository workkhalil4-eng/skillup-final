import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from("messages")
        .insert([{
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }]);
      if (insertError) throw insertError;
      setIsSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(t("contact.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-16 md:text-center max-w-3xl md:mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">{t("contact.title")}</h1>
        <p className="text-xl text-muted-foreground">{t("contact.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <Card className="border-border bg-card/50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary" aria-hidden="true">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{t("contact.emailUs")}</h3>
                <p className="text-muted-foreground">hello@skillup.com</p>
                <p className="text-sm text-muted-foreground mt-2">{t("contact.emailHint")}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary" aria-hidden="true">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{t("contact.office")}</h3>
                <p className="text-muted-foreground">
                  123 Tech Avenue, Suite 400<br />San Francisco, CA 94105
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary" aria-hidden="true">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{t("contact.community")}</h3>
                <p className="text-muted-foreground">{t("contact.communityHint")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border p-8 rounded-3xl">
          <h2 className="text-3xl font-serif font-bold mb-6">{t("contact.sendMessage")}</h2>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6" role="alert">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="bg-green-500/10 text-green-600 p-6 rounded-2xl border border-green-500/20 text-center" role="status">
              <h3 className="font-bold text-lg mb-2">{t("contact.successTitle")}</h3>
              <p>{t("contact.successHint")}</p>
              <Button className="mt-4" variant="outline" onClick={() => setIsSuccess(false)}>
                {t("contact.sendAnother")}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.name")}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.email", { defaultValue: "Email" })}</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" type="email" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.subject")}</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help you?" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.message")}</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Please provide details..."
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={t("contact.message")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("contact.sending") : t("contact.submit")}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
