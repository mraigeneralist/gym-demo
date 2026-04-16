import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Dumbbell } from "lucide-react";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CLASS_TYPES = ["All", "Spin", "HIIT", "Yoga", "Boxing", "Strength"];

const classTypeColors: Record<string, string> = {
  Spin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HIIT: "bg-red-500/20 text-red-400 border-red-500/30",
  Yoga: "bg-green-500/20 text-green-400 border-green-500/30",
  Boxing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Strength: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// Static class data (mirrors seed data so the page works without Supabase)
const classes = [
  { name: "Spin Surge", type: "Spin", instructor: "Diego Martinez", day_of_week: 1, start_time: "06:30", end_time: "07:15", capacity: 20, description: "High-energy spin class with interval training. All fitness levels welcome." },
  { name: "HIIT Blast", type: "HIIT", instructor: "Marcus Johnson", day_of_week: 1, start_time: "17:30", end_time: "18:15", capacity: 25, description: "Full-body high-intensity interval training. Burn calories and build strength." },
  { name: "Yoga Flow", type: "Yoga", instructor: "Sarah Chen", day_of_week: 2, start_time: "07:00", end_time: "08:00", capacity: 15, description: "Vinyasa flow class focusing on breath, movement, and flexibility." },
  { name: "Boxing Fundamentals", type: "Boxing", instructor: "Diego Martinez", day_of_week: 2, start_time: "18:00", end_time: "19:00", capacity: 20, description: "Learn proper boxing technique while getting an incredible workout." },
  { name: "Strength Lab", type: "Strength", instructor: "Marcus Johnson", day_of_week: 3, start_time: "06:00", end_time: "07:00", capacity: 15, description: "Structured strength training with progressive overload principles." },
  { name: "Spin Surge", type: "Spin", instructor: "Diego Martinez", day_of_week: 3, start_time: "17:30", end_time: "18:15", capacity: 20, description: "High-energy spin class with interval training." },
  { name: "HIIT Blast", type: "HIIT", instructor: "Marcus Johnson", day_of_week: 4, start_time: "06:30", end_time: "07:15", capacity: 25, description: "Full-body HIIT to start your day strong." },
  { name: "Yoga Flow", type: "Yoga", instructor: "Sarah Chen", day_of_week: 4, start_time: "18:00", end_time: "19:00", capacity: 15, description: "Evening vinyasa flow to unwind and stretch." },
  { name: "Boxing Fundamentals", type: "Boxing", instructor: "Diego Martinez", day_of_week: 5, start_time: "17:00", end_time: "18:00", capacity: 20, description: "End the week with an intense boxing session." },
  { name: "Strength Lab", type: "Strength", instructor: "Marcus Johnson", day_of_week: 5, start_time: "07:00", end_time: "08:00", capacity: 15, description: "Friday strength training — progressive overload focus." },
  { name: "Weekend Warrior HIIT", type: "HIIT", instructor: "Marcus Johnson", day_of_week: 6, start_time: "09:00", end_time: "10:00", capacity: 30, description: "Big Saturday HIIT session. All levels, maximum effort." },
  { name: "Restorative Yoga", type: "Yoga", instructor: "Sarah Chen", day_of_week: 6, start_time: "10:30", end_time: "11:30", capacity: 15, description: "Gentle restorative yoga to recover and recharge." },
];

export default function ClassesPage() {
  // Group by day
  const classesByDay = DAYS.map((day, i) => ({
    day,
    classes: classes.filter((c) => c.day_of_week === i),
  })).filter((g) => g.classes.length > 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Class <span className="text-primary">Schedule</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              From high-intensity HIIT to calming Yoga — find the perfect class
              for your goals.
            </p>
            {/* Type filter badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {CLASS_TYPES.map((type) => (
                <Badge
                  key={type}
                  variant={type === "All" ? "default" : "outline"}
                  className={
                    type === "All"
                      ? "cursor-pointer"
                      : `cursor-pointer ${classTypeColors[type] || ""}`
                  }
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10">
              {classesByDay.map((group) => (
                <div key={group.day}>
                  <h2 className="mb-4 text-xl font-bold">{group.day}</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.classes.map((cls, i) => (
                      <Card
                        key={`${cls.name}-${cls.day_of_week}-${i}`}
                        className="border-border/40 bg-card/50 transition-colors hover:border-primary/30"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">
                              {cls.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={classTypeColors[cls.type] || ""}
                            >
                              {cls.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {cls.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {cls.start_time} - {cls.end_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {cls.capacity} spots
                            </span>
                            <span className="flex items-center gap-1">
                              <Dumbbell className="h-3.5 w-3.5" />
                              {cls.instructor}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
