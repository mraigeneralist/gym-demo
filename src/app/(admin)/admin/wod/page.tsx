"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Flame, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ExerciseInput {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export default function AdminWodPage() {
  const [wods, setWods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    { name: "", sets: "3", reps: "10", notes: "" },
  ]);

  const loadWods = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("workouts_of_day")
      .select("*")
      .order("date", { ascending: false })
      .limit(30);
    setWods(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWods();
  }, [loadWods]);

  function addExercise() {
    setExercises([...exercises, { name: "", sets: "3", reps: "10", notes: "" }]);
  }

  function removeExercise(i: number) {
    setExercises(exercises.filter((_, idx) => idx !== i));
  }

  function updateExercise(i: number, field: string, value: string) {
    const updated = [...exercises];
    (updated[i] as any)[field] = value;
    setExercises(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const exerciseJson = exercises
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name,
        sets: parseInt(ex.sets) || 3,
        reps: ex.reps,
        notes: ex.notes || undefined,
      }));

    const { error } = await supabase.from("workouts_of_day").upsert(
      {
        date: form.get("date") as string,
        title: form.get("title") as string,
        description: form.get("description") as string,
        exercises: exerciseJson,
        created_by: user?.id,
      },
      { onConflict: "date" }
    );

    if (error) {
      toast.error("Failed to save WOD");
      return;
    }

    toast.success("Workout of the Day saved!");
    setDialogOpen(false);
    setExercises([{ name: "", sets: "3", reps: "10", notes: "" }]);
    loadWods();
  }

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
          <h1 className="text-3xl font-bold">Workout of the Day</h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage daily workouts for members.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post WOD
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post Workout of the Day</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Full Body Burn"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A balanced full-body workout..."
                  rows={2}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Exercises</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExercise}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                {exercises.map((ex, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-end rounded-lg border border-border/40 p-3"
                  >
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Exercise name"
                        value={ex.name}
                        onChange={(e) =>
                          updateExercise(i, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-16 space-y-1">
                      <Input
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) =>
                          updateExercise(i, "sets", e.target.value)
                        }
                      />
                    </div>
                    <div className="w-20 space-y-1">
                      <Input
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) =>
                          updateExercise(i, "reps", e.target.value)
                        }
                      />
                    </div>
                    {exercises.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(i)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full">
                Save Workout
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* WOD List */}
      <div className="space-y-4">
        {wods.length === 0 ? (
          <Card className="border-border/40 bg-card/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Flame className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No workouts posted yet.</p>
            </CardContent>
          </Card>
        ) : (
          wods.map((wod) => {
            const isToday =
              wod.date === new Date().toISOString().split("T")[0];
            return (
              <Card
                key={wod.id}
                className={`border-border/40 bg-card/50 ${
                  isToday ? "border-primary/30" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{wod.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {isToday && <Badge>Today</Badge>}
                      <span className="text-sm text-muted-foreground">
                        {new Date(wod.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {wod.description && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      {wod.description}
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {(wod.exercises as any[])?.map(
                      (ex: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded border border-border/40 px-3 py-2 text-sm"
                        >
                          <span>{ex.name}</span>
                          <span className="text-muted-foreground">
                            {ex.sets} x {ex.reps}
                            {ex.notes && ` — ${ex.notes}`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
