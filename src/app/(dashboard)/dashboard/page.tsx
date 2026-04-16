import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Flame,
  Dumbbell,
  ArrowRight,
  CalendarPlus,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Fetch active membership
  const { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("member_id", user!.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch upcoming bookings
  const today = new Date().toISOString().split("T")[0];
  const { data: upcomingBookings } = await supabase
    .from("bookings")
    .select("*, classes(name, type, start_time, end_time, trainers(name))")
    .eq("member_id", user!.id)
    .eq("status", "confirmed")
    .gte("class_date", today)
    .order("class_date", { ascending: true })
    .limit(3);

  // Fetch attendance count (confirmed bookings with past dates)
  const { count: attendanceCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("member_id", user!.id)
    .eq("status", "confirmed")
    .lt("class_date", today);

  // Fetch today's WOD
  const { data: todayWod } = await supabase
    .from("workouts_of_day")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Member"}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your fitness overview for today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membership</p>
                <p className="font-semibold capitalize">
                  {membership ? membership.plan : "None"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="font-semibold">
                  {upcomingBookings?.length || 0} classes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attended</p>
                <p className="font-semibold">
                  {attendanceCount || 0} classes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Referral Code</p>
                <p className="font-mono text-sm font-semibold">
                  {profile?.referral_code || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Upcoming Classes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/book">
                <CalendarPlus className="mr-1 h-4 w-4" />
                Book
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!upcomingBookings || upcomingBookings.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No upcoming classes</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/dashboard/book">Book your first class</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 p-3"
                  >
                    <div>
                      <p className="font-medium">{booking.classes?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.class_date).toLocaleDateString(
                          "en-US",
                          { weekday: "short", month: "short", day: "numeric" }
                        )}{" "}
                        &middot; {booking.classes?.start_time?.slice(0, 5)} -{" "}
                        {booking.classes?.end_time?.slice(0, 5)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {booking.classes?.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's WOD */}
        <Card className="border-border/40 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Workout of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            {!todayWod ? (
              <div className="py-8 text-center text-muted-foreground">
                <Dumbbell className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No workout posted for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">{todayWod.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {todayWod.description}
                </p>
                <div className="space-y-2">
                  {(todayWod.exercises as any[])?.map(
                    (ex: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded border border-border/40 px-3 py-2 text-sm"
                      >
                        <span>{ex.name}</span>
                        <span className="text-muted-foreground">
                          {ex.sets} x {ex.reps}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Membership CTA if no membership */}
      {!membership && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Get a Membership</h3>
              <p className="text-sm text-muted-foreground">
                Unlock unlimited classes, progress tracking, and more.
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">
                View Plans <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
