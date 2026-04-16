"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Calendar, CalendarPlus, X } from "lucide-react";
import { toast } from "sonner";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("bookings")
      .select("*, classes(name, type, start_time, end_time)")
      .eq("member_id", user.id)
      .order("class_date", { ascending: false });

    setBookings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleCancel(bookingId: string, classId: string, classDate: string) {
    setCancelling(bookingId);
    const supabase = createClient();

    // Update booking status
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast.error("Failed to cancel booking");
      setCancelling(null);
      return;
    }

    // Promote from waitlist if anyone is waiting
    const { data: nextInLine } = await supabase
      .from("waitlist")
      .select("*")
      .eq("class_id", classId)
      .eq("class_date", classDate)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextInLine) {
      // Promote to confirmed
      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("member_id", nextInLine.member_id)
        .eq("class_id", classId)
        .eq("class_date", classDate)
        .eq("status", "waitlist");

      // Remove from waitlist
      await supabase.from("waitlist").delete().eq("id", nextInLine.id);

      console.log(
        `[EMAIL] Promoted member ${nextInLine.member_id} from waitlist for class ${classId} on ${classDate}`
      );
    }

    toast.success("Booking cancelled");
    setCancelling(null);
    loadBookings();
  }

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter(
    (b) => b.class_date >= today && b.status !== "cancelled"
  );
  const past = bookings.filter(
    (b) => b.class_date < today || b.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    waitlist: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  function BookingCard({ booking, showCancel }: { booking: any; showCancel?: boolean }) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{booking.classes?.name}</p>
            <Badge
              variant="outline"
              className={statusColor[booking.status] || ""}
            >
              {booking.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(booking.class_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}{" "}
            &middot; {booking.classes?.start_time?.slice(0, 5)} -{" "}
            {booking.classes?.end_time?.slice(0, 5)}
          </p>
        </div>
        {showCancel && booking.status !== "cancelled" && (
          <Button
            variant="ghost"
            size="sm"
            disabled={cancelling === booking.id}
            onClick={() =>
              handleCancel(booking.id, booking.class_id, booking.class_date)
            }
            className="text-destructive hover:text-destructive"
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="mt-1 text-muted-foreground">
            View and manage your class bookings.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/book">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book a Class
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <Card className="border-border/40 bg-card/50">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground opacity-50" />
                <div>
                  <h3 className="text-lg font-semibold">No Upcoming Bookings</h3>
                  <p className="text-sm text-muted-foreground">
                    Book a class to get started!
                  </p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/book">Browse Classes</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showCancel
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <Card className="border-border/40 bg-card/50">
              <CardContent className="py-12 text-center text-muted-foreground">
                No past bookings yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
