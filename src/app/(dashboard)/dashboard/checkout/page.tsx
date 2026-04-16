"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { MEMBERSHIP_PLANS } from "@/lib/types/database";
import type { MembershipInterval } from "@/lib/types/database";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "pro";
  const plan = MEMBERSHIP_PLANS.find((p) => p.plan === planParam) || MEMBERSHIP_PLANS[1];
  const [interval, setInterval] = useState<MembershipInterval>("monthly");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedPrice = plan.prices.find((p) => p.interval === interval)!;

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in first");
      setProcessing(false);
      return;
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    if (interval === "monthly") endDate.setMonth(endDate.getMonth() + 1);
    else if (interval === "3month") endDate.setMonth(endDate.getMonth() + 3);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    const { error } = await supabase.from("memberships").insert({
      member_id: user.id,
      plan: plan.plan,
      interval: interval,
      price: selectedPrice.price,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      status: "active",
    });

    if (error) {
      toast.error("Failed to create membership");
      setProcessing(false);
      return;
    }

    console.log(
      `[PAYMENT] Mock payment of $${selectedPrice.price} for ${plan.name} ${interval} plan by ${user.email}`
    );

    setProcessing(false);
    setSuccess(true);
    toast.success("Membership activated!");
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CheckCircle className="mb-4 h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold">Welcome to {plan.name}!</h1>
        <p className="mt-2 text-muted-foreground">
          Your membership is now active. Enjoy all the benefits!
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/book">Book a Class</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/pricing">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-1 text-muted-foreground">
          Complete your membership purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Details
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                <Lock className="mr-1 inline h-3 w-3" />
                This is a demo — no real payment will be processed.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${selectedPrice.price}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{plan.name} Plan</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {plan.plan}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Billing Interval</Label>
                <Select
                  value={interval}
                  onValueChange={(v) => setInterval(v as MembershipInterval)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plan.prices.map((p) => (
                      <SelectItem key={p.interval} value={p.interval}>
                        {p.label} — ${p.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${selectedPrice.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${selectedPrice.price}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground">
                  Includes: {plan.features.join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
