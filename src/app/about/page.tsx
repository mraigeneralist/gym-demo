import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Users, Award } from "lucide-react";

const trainers = [
  {
    name: "Marcus Johnson",
    bio: "Former professional athlete with 10+ years of coaching experience. Specializes in high-intensity functional training and sports performance.",
    specialties: ["HIIT", "Strength Training", "Sports Performance"],
    initials: "MJ",
  },
  {
    name: "Sarah Chen",
    bio: "Certified yoga instructor and wellness coach. Passionate about mindfulness, flexibility, and holistic fitness approaches.",
    specialties: ["Yoga", "Pilates", "Meditation", "Flexibility"],
    initials: "SC",
  },
  {
    name: "Diego Martinez",
    bio: "Professional boxing coach and certified personal trainer. Brings energy and discipline to every session.",
    specialties: ["Boxing", "Kickboxing", "Cardio", "Spin"],
    initials: "DM",
  },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Every program, class, and session is designed to deliver measurable progress.",
  },
  {
    icon: Heart,
    title: "Community First",
    description:
      "We build an inclusive, supportive environment where everyone belongs.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description:
      "Our trainers are certified professionals who invest in your success.",
  },
  {
    icon: Award,
    title: "Continuous Growth",
    description:
      "We evolve our programs and facilities to stay at the cutting edge of fitness.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              About <span className="text-primary">JERAI FITNESS</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              More than a gym — a community built on passion, discipline, and
              the belief that everyone deserves to feel strong.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold">Our Story</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <p>
                  Founded in 2018, JERAI FITNESS started with a simple
                  idea: fitness should be accessible, enjoyable, and
                  effective for everyone — not just athletes.
                </p>
                <p>
                  What began as a small studio with three trainers has
                  grown into a full-service fitness center with
                  state-of-the-art equipment, a diverse class schedule,
                  and a thriving community of over 2,500 members.
                </p>
                <p>
                  Our approach combines cutting-edge training methods with
                  a welcoming atmosphere. Whether you&apos;re taking your
                  first step into fitness or training for a competition,
                  you&apos;ll find the support and resources you need here.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-border/40 bg-card/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Our Values</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="space-y-2">
                  <value.icon className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trainers */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">Meet Our Trainers</h2>
            <p className="text-muted-foreground mb-8">
              Certified professionals passionate about helping you reach your
              goals.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {trainers.map((trainer) => (
                <Card
                  key={trainer.name}
                  className="border-border/40 bg-card/50 transition-colors hover:border-primary/30"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      {trainer.initials}
                    </div>
                    <h3 className="text-lg font-semibold">{trainer.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {trainer.bio}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {trainer.specialties.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="text-xs"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
