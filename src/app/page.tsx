import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Users,
  Calendar,
  Trophy,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Active Members", value: "2,500+", icon: Users },
  { label: "Classes Weekly", value: "50+", icon: Calendar },
  { label: "Expert Trainers", value: "15", icon: Dumbbell },
  { label: "Years Running", value: "8", icon: Trophy },
];

const features = [
  {
    icon: Zap,
    title: "High-Energy Classes",
    description:
      "From HIIT to Yoga, Boxing to Spin — find the class that matches your energy.",
  },
  {
    icon: Users,
    title: "Expert Coaching",
    description:
      "Our certified trainers bring years of experience to every session.",
  },
  {
    icon: Shield,
    title: "Member Portal",
    description:
      "Track your progress, book classes, and manage your membership online.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description:
      "Open early, close late. Train on your schedule, not ours.",
  },
];

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Member for 2 years",
    quote:
      "JERAI FITNESS completely transformed my approach to fitness. The trainers genuinely care about your progress.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Pro Member",
    quote:
      "The class variety is incredible. I went from dreading workouts to looking forward to them every single day.",
    rating: 5,
  },
  {
    name: "Jordan Chen",
    role: "Elite Member",
    quote:
      "Best investment I've made. The community here pushes you to be better without any of the intimidation.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                Now open — new downtown location
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Push Your Limits.{" "}
                <span className="text-primary">Transform Your Life.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Premium facilities, world-class trainers, and a community that
                lifts you up. Start your fitness journey today with JERAI
                FITNESS.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/classes">Browse Classes</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border/40 bg-card/50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to{" "}
                <span className="text-primary">Succeed</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                We provide the tools, space, and support to help you crush your
                fitness goals.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-border/40 bg-card/50 transition-colors hover:border-primary/30"
                >
                  <CardContent className="pt-6">
                    <feature.icon className="mb-3 h-8 w-8 text-primary" />
                    <h3 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border/40 bg-card/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Members Say
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Real results from real people in our community.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card
                  key={t.name}
                  className="border-border/40 bg-card/50"
                >
                  <CardContent className="pt-6">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-8 text-center sm:p-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join JERAI FITNESS today and get your first week free. No
                contracts, no commitments — just results.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
