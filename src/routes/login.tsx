import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AY Astute Group CRM" },
      { name: "description", content: "Sign in to your AY Astute Group CRM workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-between px-8 py-10 lg:px-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
            <span className="font-display text-base font-bold">A</span>
          </div>
          <div>
            <p className="font-display text-sm font-bold">AY Astute Group</p>
            <p className="text-[11px] text-muted-foreground">Audit · Tax · Advisory · Consulting</p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage customers, leads, and revenue.</p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@ay-uae.com" defaultValue="sana@ay-uae.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" className="h-11" />
            </div>
            <Button type="submit" className="h-11 w-full text-sm font-semibold">Sign in to workspace</Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo prototype — any credentials will sign you in.
            </p>
          </form>
        </div>

        <p className="text-xs text-muted-foreground">© 2026 AY Astute Group · AY CA Auditing LLC · Astute Tax Consultancy LLC. All rights reserved.</p>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary lg:block">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 30%)" }} />
        <div className="relative flex h-full flex-col justify-between p-16 text-primary-foreground">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> FTA Approved Tax Agency · MOE Approved Auditor
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight">
              Your strategic financial<br />partner in the UAE.
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/80">
              Audit, Tax, Accounting & Consulting — one workspace to manage every client engagement across Abu Dhabi, Dubai and beyond.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: "Clients served", value: "1,100+" },
              { icon: TrendingUp, label: "Years in UAE", value: "10+" },
              { icon: ShieldCheck, label: "Industries", value: "18+" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * i }}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur"
              >
                <s.icon className="h-5 w-5 text-white/80" />
                <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
