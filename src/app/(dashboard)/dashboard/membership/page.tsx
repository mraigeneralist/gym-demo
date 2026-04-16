"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { CreditCard, Calendar, ArrowRight } from "lucide-react";
import type { Profile, Membership } from "@/lib/types/database";

export default function MembershipPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, membershipRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase
          .from("memberships")
          .select("*")
          .eq("member_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setProfile(profileRes.data);
      setMembership(membershipRes.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Membership Card</h1>
        <p className="mt-1 text-muted-foreground">
          Your digital membership and plan details.
        </p>
      </div>

      {/* Digital Membership Card */}
      <Card className="max-w-md overflow-hidden border-primary/30">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                JERAI FITNESS
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {profile?.full_name || "Member"}
              </h2>
              {membership && (
                <Badge className="mt-2 capitalize">{membership.plan} Plan</Badge>
              )}
            </div>
            <div className="rounded-lg bg-white p-2">
              <QRCodeSVG
                value={`jerai-fitness:member:${profile?.id || "demo"}`}
                size={80}
                level="M"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Member Since</p>
              <p className="font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Referral Code</p>
              <p className="font-mono font-medium">
                {profile?.referral_code || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Membership Details */}
      {membership ? (
        <Card className="border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Plan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold capitalize">{membership.plan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing</p>
                <p className="font-semibold capitalize">
                  {membership.interval}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold">${membership.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    membership.status === "active" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {membership.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">
                    {new Date(membership.start_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="text-sm font-medium">
                    {new Date(membership.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <CreditCard className="h-12 w-12 text-primary opacity-50" />
            <div>
              <h3 className="text-lg font-semibold">No Active Membership</h3>
              <p className="text-sm text-muted-foreground">
                Choose a plan to unlock all features.
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
