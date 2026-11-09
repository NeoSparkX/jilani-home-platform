'use client';

import { useUser } from "@/components/providers/UserProvider";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProfileTab } from "@/components/dashboard/settings/ProfileTab";
import { SecurityTab } from "@/components/dashboard/settings/SecurityTab";
import { User, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminProfileSection = "profile" | "security";

const SECTIONS: { id: AdminProfileSection; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile Info", icon: User },
  { id: "security", label: "Password & Security", icon: Lock },
];

export default function AdminProfilePage() {
  const user = useUser();
  const [active, setActive] = useState<AdminProfileSection>("profile");

  return (
    <div className="w-full min-w-0 space-y-8 pb-16">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Personal Account</p>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Manage your personal admin credentials, contact details, and security.</p>
      </motion.div>

      <div className="grid min-w-0 grid-cols-1 gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="min-w-0">
          <GlassCard className="p-3 bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5 shadow-sm">
            <nav className="space-y-1.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group",
                    active === s.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <s.icon className={cn("w-5 h-5", active === s.id ? "!text-white" : "text-gray-400 group-hover:text-blue-500")} />
                    <span className="truncate">{s.label}</span>
                  </span>
                  <ChevronRight className={cn("w-4 h-4 flex-shrink-0 transition-transform", active === s.id ? "rotate-90 !text-white" : "opacity-0 group-hover:opacity-100")} />
                </button>
              ))}
            </nav>
          </GlassCard>
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {active === "profile" && <ProfileTab user={user} />}
            {active === "security" && <SecurityTab />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
