import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList } from "lucide-react";

const statusColor: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  waitlist: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, classes(name, type), profiles(full_name)")
    .order("class_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          View all class bookings across members.
        </p>
      </div>

      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            All Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!bookings || bookings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ClipboardList className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No bookings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Booked At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        {new Date(booking.class_date).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {booking.classes?.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {booking.classes?.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {booking.profiles?.full_name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColor[booking.status] || ""}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
