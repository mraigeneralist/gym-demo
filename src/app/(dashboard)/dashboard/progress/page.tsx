"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, LineChart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { ProgressLog } from "@/lib/types/database";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ProgressPage() {
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadLogs = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("progress_logs")
      .select("*")
      .eq("member_id", user.id)
      .order("date", { ascending: true });

    setLogs((data as ProgressLog[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("progress_logs").insert({
      member_id: user.id,
      date: form.get("date") as string,
      weight: form.get("weight") ? Number(form.get("weight")) : null,
      notes: (form.get("notes") as string) || null,
      metrics: {
        bench_press: form.get("bench_press")
          ? Number(form.get("bench_press"))
          : undefined,
        squat: form.get("squat") ? Number(form.get("squat")) : undefined,
        deadlift: form.get("deadlift")
          ? Number(form.get("deadlift"))
          : undefined,
        body_fat: form.get("body_fat")
          ? Number(form.get("body_fat"))
          : undefined,
      },
    });

    if (error) {
      toast.error("Failed to log progress");
    } else {
      toast.success("Progress logged!");
      setDialogOpen(false);
      loadLogs();
    }
    setSubmitting(false);
  }

  const chartData = logs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    weight: log.weight,
    bench: log.metrics?.bench_press,
    squat: log.metrics?.squat,
    deadlift: log.metrics?.deadlift,
  }));

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Log your weight, lifts, and body measurements over time.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Progress</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Body Weight (lbs)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  placeholder="185.5"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="bench_press">Bench (lbs)</Label>
                  <Input
                    id="bench_press"
                    name="bench_press"
                    type="number"
                    placeholder="225"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squat">Squat (lbs)</Label>
                  <Input
                    id="squat"
                    name="squat"
                    type="number"
                    placeholder="315"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadlift">Deadlift (lbs)</Label>
                  <Input
                    id="deadlift"
                    name="deadlift"
                    type="number"
                    placeholder="405"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body_fat">Body Fat %</Label>
                <Input
                  id="body_fat"
                  name="body_fat"
                  type="number"
                  step="0.1"
                  placeholder="15.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="How did you feel today?"
                  rows={2}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                Save Entry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {logs.length === 0 ? (
        <Card className="border-border/40 bg-card/50">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <LineChart className="h-12 w-12 text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-semibold">No Progress Logged Yet</h3>
              <p className="text-sm text-muted-foreground">
                Start tracking your fitness journey by adding your first entry.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Weight Chart */}
          {chartData.some((d) => d.weight) && (
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Body Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lifts Chart */}
          {chartData.some((d) => d.bench || d.squat || d.deadlift) && (
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Strength Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Line type="monotone" dataKey="bench" name="Bench" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="squat" name="Squat" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Entries Table */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...logs].reverse().slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(log.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-muted-foreground">
                          {log.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {log.weight && <span>{log.weight} lbs</span>}
                      {log.metrics?.bench_press && (
                        <span>B: {log.metrics.bench_press}</span>
                      )}
                      {log.metrics?.squat && (
                        <span>S: {log.metrics.squat}</span>
                      )}
                      {log.metrics?.deadlift && (
                        <span>D: {log.metrics.deadlift}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
