"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Users, Dumbbell, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const classTypeColors: Record<string, string> = {
  Spin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  HIIT: "bg-red-500/20 text-red-400 border-red-500/30",
  Yoga: "bg-green-500/20 text-green-400 border-green-500/30",
  Boxing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Strength: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function BookClassPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [myBookings, setMyBookings] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDay, setFilterDay] = useState<string>("all");

  // Get the next occurrence of a given day_of_week
  function getNextDate(dayOfWeek: number): string {
    const today = new Date();
    const todayDay = today.getDay();
    let daysAhead = dayOfWeek - todayDay;
    if (daysAhead < 0) daysAhead += 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysAhead);
    return nextDate.toISOString().split("T")[0];
  }

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch classes with trainer info
    const { data: classData } = await supabase
      .from("classes")
      .select("*, trainers(name)")
      .order("day_of_week")
      .order("start_time");

    setClasses(classData || []);

    // Fetch booking counts for this week
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const { data: bookings } = await supabase
      .from("bookings")
      .select("class_id, class_date")
      .eq("status", "confirmed")
      .gte("class_date", today.toISOString().split("T")[0])
      .lte("class_date", endOfWeek.toISOString().split("T")[0]);

    const counts: Record<string, number> = {};
    bookings?.forEach((b) => {
      const key = `${b.class_id}-${b.class_date}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    setBookingCounts(counts);

    // Fetch user's existing bookings
    const { data: myBookingData } = await supabase
      .from("bookings")
      .select("class_id, class_date")
      .eq("member_id", user.id)
      .in("status", ["confirmed", "waitlist"])
      .gte("class_date", today.toISOString().split("T")[0]);

    const mySet = new Set<string>();
    myBookingData?.forEach((b) =>
      mySet.add(`${b.class_id}-${b.class_date}`)
    );
    setMyBookings(mySet);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleBook(classItem: any) {
    const classDate = getNextDate(classItem.day_of_week);
    const key = `${classItem.id}-${classDate}`;
    setBooking(key);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const currentCount = bookingCounts[key] || 0;
    const isFull = currentCount >= classItem.capacity;

    if (isFull) {
      // Add to waitlist
      const { data: maxPos } = await supabase
        .from("waitlist")
        .select("position")
        .eq("class_id", classItem.id)
        .eq("class_date", classDate)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextPos = (maxPos?.position || 0) + 1;

      await supabase.from("bookings").insert({
        member_id: user.id,
        class_id: classItem.id,
        class_date: classDate,
        status: "waitlist",
      });

      await supabase.from("waitlist").insert({
        member_id: user.id,
        class_id: classItem.id,
        class_date: classDate,
        position: nextPos,
      });

      toast.info(`Class is full! You're #${nextPos} on the waitlist.`);
      console.log(
        `[EMAIL] Waitlist confirmation for ${user.email} - ${classItem.name} on ${classDate}, position ${nextPos}`
      );
    } else {
      // Confirm booking
      const { error } = await supabase.from("bookings").insert({
        member_id: user.id,
        class_id: classItem.id,
        class_date: classDate,
        status: "confirmed",
      });

      if (error) {
        toast.error("Failed to book class");
        setBooking(null);
        return;
      }

      toast.success(`Booked ${classItem.name}!`);
      console.log(
        `[EMAIL] Booking confirmation for ${user.email} - ${classItem.name} on ${classDate}`
      );
    }

    setBooking(null);
    loadData();
  }

  const filteredClasses = classes.filter((cls) => {
    if (filterType !== "all" && cls.type !== filterType) return false;
    if (filterDay !== "all" && cls.day_of_week !== parseInt(filterDay))
      return false;
    return true;
  });

  const uniqueTypes = Array.from(new Set(classes.map((c) => c.type)));

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Book a Class</h1>
        <p className="mt-1 text-muted-foreground">
          Browse this week&apos;s schedule and reserve your spot.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Class Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterDay} onValueChange={setFilterDay}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Days</SelectItem>
            {DAYS.map((day, i) => (
              <SelectItem key={i} value={i.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredClasses.map((cls) => {
          const classDate = getNextDate(cls.day_of_week);
          const key = `${cls.id}-${classDate}`;
          const booked = myBookings.has(key);
          const confirmedCount = bookingCounts[key] || 0;
          const spotsLeft = cls.capacity - confirmedCount;
          const isFull = spotsLeft <= 0;

          return (
            <Card
              key={cls.id}
              className="border-border/40 bg-card/50 transition-colors hover:border-primary/30"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{cls.name}</CardTitle>
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
                    {DAYS[cls.day_of_week]} {cls.start_time?.slice(0, 5)} -{" "}
                    {cls.end_time?.slice(0, 5)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {isFull ? (
                      <span className="text-yellow-400">Full</span>
                    ) : (
                      `${spotsLeft} / ${cls.capacity} spots`
                    )}
                  </span>
                  {cls.trainers?.name && (
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-3.5 w-3.5" />
                      {cls.trainers.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    Next: {new Date(classDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {booked ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Booked
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant={isFull ? "outline" : "default"}
                      disabled={booking === key}
                      onClick={() => handleBook(cls)}
                    >
                      {booking === key ? (
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      ) : null}
                      {isFull ? "Join Waitlist" : "Book Now"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No classes found with current filters.
        </div>
      )}
    </div>
  );
}
