import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for exploring the platform and starting your journey.",
      features: [
        "Access to 5 introductory courses",
        "Community forum access",
        "Basic progress tracking",
        "7-day trial for Pro features"
      ],
      buttonText: "Get Started for Free",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "The complete package for serious learners and professionals.",
      features: [
        "Unlimited access to all courses",
        "Premium support & 1-on-1 mentorship",
        "Downloadable resources & code",
        "Official certificates of completion",
        "Exclusive networking events"
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for teams and organizations of any size.",
      features: [
        "Everything in Pro",
        "Custom learning paths",
        "Team analytics & reporting",
        "Dedicated account manager",
        "Single Sign-On (SSO)"
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    }
  ];

  return (
    <div className="container py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-muted-foreground mb-4">Invest in your career with our flexible plans. No hidden fees, cancel anytime.</p>
        <div className="inline-flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <p className="text-sm font-medium">Note: This is an illustrative portfolio project. Payments are disabled.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative overflow-hidden transition-all duration-300 ${plan.isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border bg-card/50'}`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 inset-x-0 h-1.5 bg-primary" />
            )}
            <CardHeader>
              {plan.isPopular && (
                <div className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Most Popular</div>
              )}
              <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
              <CardDescription className="text-base h-12">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <span className="text-5xl font-bold font-serif">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full opacity-50 cursor-not-allowed" 
                variant={plan.isPopular ? "default" : "outline"}
                size="lg"
                disabled
                title="Payments are disabled for this illustrative project."
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
