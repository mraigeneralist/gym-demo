"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
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

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const [classRes, trainerRes] = await Promise.all([
      supabase
        .from("classes")
        .select("*, trainers(name)")
        .order("day_of_week")
        .order("start_time"),
      supabase.from("trainers").select("*").order("name"),
    ]);
    setClasses(classRes.data || []);
    setTrainers(trainerRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const classData = {
      name: form.get("name") as string,
      type: form.get("type") as string,
      instructor_id: form.get("instructor_id") as string,
      day_of_week: parseInt(form.get("day_of_week") as string),
      start_time: form.get("start_time") as string,
      end_time: form.get("end_time") as string,
      capacity: parseInt(form.get("capacity") as string),
      description: form.get("description") as string,
    };

    if (editingClass) {
      const { error } = await supabase
        .from("classes")
        .update(classData)
        .eq("id", editingClass.id);
      if (error) {
        toast.error("Failed to update class");
        return;
      }
      toast.success("Class updated!");
    } else {
      const { error } = await supabase.from("classes").insert(classData);
      if (error) {
        toast.error("Failed to create class");
        return;
      }
      toast.success("Class created!");
    }

    setDialogOpen(false);
    setEditingClass(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this class? This will also remove all its bookings."))
      return;
    const supabase = createClient();
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete class");
      return;
    }
    toast.success("Class deleted");
    loadData();
  }

  function openEdit(cls: any) {
    setEditingClass(cls);
    setDialogOpen(true);
  }

  function openCreate() {
    setEditingClass(null);
    setDialogOpen(true);
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
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your class schedule.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditingClass(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Edit Class" : "Add Class"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingClass?.name || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    name="type"
                    placeholder="HIIT, Yoga, etc."
                    defaultValue={editingClass?.type || ""}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor_id">Instructor</Label>
                  <Select
                    name="instructor_id"
                    defaultValue={editingClass?.instructor_id || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Day</Label>
                  <Select
                    name="day_of_week"
                    defaultValue={editingClass?.day_of_week?.toString() || "1"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    defaultValue={editingClass?.start_time?.slice(0, 5) || "09:00"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    name="end_time"
                    type="time"
                    defaultValue={editingClass?.end_time?.slice(0, 5) || "10:00"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    defaultValue={editingClass?.capacity || 20}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingClass?.description || ""}
                  rows={2}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingClass ? "Update Class" : "Create Class"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule ({classes.length} classes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No classes yet. Create your first one!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cls.type}</Badge>
                      </TableCell>
                      <TableCell>{DAYS[cls.day_of_week]}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {cls.start_time?.slice(0, 5)} - {cls.end_time?.slice(0, 5)}
                      </TableCell>
                      <TableCell>{cls.trainers?.name || "—"}</TableCell>
                      <TableCell>{cls.capacity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(cls)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(cls.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
