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
import { Users } from "lucide-react";

export default async function AdminMembersPage() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("profiles")
    .select(
      "*, memberships(plan, status, start_date, end_date)"
    )
    .eq("role", "member")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage all gym members.
        </p>
      </div>

      <Card className="border-border/40 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            All Members ({members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!members || members.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Users className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No members registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member: any) => {
                    const activeMembership = member.memberships?.find(
                      (m: any) => m.status === "active"
                    );
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.full_name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {member.phone || "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {member.referral_code}
                        </TableCell>
                        <TableCell>
                          {activeMembership ? (
                            <Badge variant="outline" className="capitalize">
                              {activeMembership.plan}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {activeMembership ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(
                            member.created_at
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
