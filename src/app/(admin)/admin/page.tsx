import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Calendar, DollarSign } from "lucide-react";

export default async function AdminOverview() {
  const supabase = await createClient();

  // Total members
  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "member");

  // Active memberships
  const { count: activeMembershipCount } = await supabase
    .from("memberships")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Today's bookings
  const today = new Date().toISOString().split("T")[0];
  const { count: todayBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("class_date", today)
    .eq("status", "confirmed");

  // Mock revenue (sum of active membership prices)
  const { data: memberships } = await supabase
    .from("memberships")
    .select("price")
    .eq("status", "active");

  const totalRevenue =
    memberships?.reduce((sum, m) => sum + Number(m.price), 0) || 0;

  const stats = [
    {
      label: "Total Members",
      value: memberCount || 0,
      icon: Users,
      description: "Registered members",
    },
    {
      label: "Active Memberships",
      value: activeMembershipCount || 0,
      icon: CreditCard,
      description: "Currently active",
    },
    {
      label: "Today's Bookings",
      value: todayBookings || 0,
      icon: Calendar,
      description: "Confirmed for today",
    },
    {
      label: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From active memberships",
    },
  ];

  // Recent members
  const { data: recentMembers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "member")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your gym operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/40 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Members */}
      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentMembers || recentMembers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No members yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-3"
                >
                  <div>
                    <p className="font-medium">{member.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined{" "}
                      {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {member.referral_code}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
