"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderEntry {
  member_id: string;
  full_name: string;
  count: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // Get this month's date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      // Fetch confirmed bookings this month with profile names
      const { data: bookings } = await supabase
        .from("bookings")
        .select("member_id, profiles(full_name)")
        .eq("status", "confirmed")
        .gte("class_date", startOfMonth)
        .lte("class_date", endOfMonth);

      // Count per member
      const countMap: Record<string, { name: string; count: number }> = {};
      bookings?.forEach((b: any) => {
        if (!countMap[b.member_id]) {
          countMap[b.member_id] = {
            name: b.profiles?.full_name || "Member",
            count: 0,
          };
        }
        countMap[b.member_id].count++;
      });

      const sorted = Object.entries(countMap)
        .map(([id, data]) => ({
          member_id: id,
          full_name: data.name,
          count: data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

      setLeaders(sorted);
      setLoading(false);
    }
    load();
  }, []);

  const rankIcons = [
    <Trophy key="1" className="h-5 w-5 text-yellow-400" />,
    <Medal key="2" className="h-5 w-5 text-gray-300" />,
    <Award key="3" className="h-5 w-5 text-orange-400" />,
  ];

  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">
          Most classes attended in {monthName}. Keep pushing!
        </p>
      </div>

      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            {monthName} Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaders.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Trophy className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No attendance data yet this month.</p>
              <p className="text-sm">Book and attend classes to appear here!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaders.map((entry, i) => (
                <div
                  key={entry.member_id}
                  className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    entry.member_id === currentUserId
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center">
                      {i < 3 ? (
                        rankIcons[i]
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          #{i + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {entry.full_name}
                        {entry.member_id === currentUserId && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      {entry.count}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      classes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
