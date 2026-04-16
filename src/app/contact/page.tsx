"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Contact form submitted:", {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    });
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Have a question or want to visit? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card className="border-border/40 bg-card/50">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          123 Fitness Boulevard
                          <br />
                          Downtown, CA 90210
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          (555) 123-4567
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          hello@jeraifitness.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Hours</p>
                        <p className="text-sm text-muted-foreground">
                          Mon-Fri: 5AM - 10PM
                          <br />
                          Sat: 7AM - 8PM
                          <br />
                          Sun: 8AM - 6PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-border/40 bg-card/50">
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <CheckCircle className="h-12 w-12 text-primary" />
                        <h3 className="text-xl font-semibold">
                          Message Sent!
                        </h3>
                        <p className="text-muted-foreground">
                          Thanks for reaching out. We&apos;ll get back to you
                          within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSubmitted(false)}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="What's this about?"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us more..."
                            rows={5}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
