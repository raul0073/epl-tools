'use client';

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function EmailSignInForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // optional for registration
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/email-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, team_name: teamName }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to register");
      } else {
        toast.success("Check your inbox for the login link!");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-24">
      <Card className="w-[360px] text-center">
        <CardHeader>
          <CardTitle>Email Registration / Login</CardTitle>
          <CardDescription>Enter your email to receive a magic link</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleEmailRegister}>
            <div className="relative">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <Input
              type="text"
              placeholder="Your Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Team Name (optional)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
