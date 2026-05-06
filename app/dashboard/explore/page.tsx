'use client';

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Heart,
  ShieldCheck,
  Building2,
  Grid3X3,
  List,
  Users,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const OFFICE_IMG = "https://images.unsplash.com/photo-1640109390671-edce15340659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwb2ZmaWNlJTIwc3BhY2UlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3Nzc3MzE4NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const HALL_IMG = "https://images.unsplash.com/photo-1763231575952-98244918f99b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVudCUyMGhhbGwlMjBlbGVnYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3NzMxODczfDA&ixlib=rb-4.1.0&q=80&w=1080";
const PENT_IMG = "https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NzczMTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080";

const PROPERTIES = [
  { id: 1, title: "The Summit Office Tower", location: "Gulshan, Dhaka", price: "8,000", period: "day", rating: 4.9, reviews: 124, image: OFFICE_IMG, type: "Office Space", cap: 50, featured: true },
  { id: 2, title: "Grand Convention Palace", location: "Agrabad, Chittagong", price: "25,000", period: "day", rating: 4.8, reviews: 87, image: HALL_IMG, type: "Convention Hall", cap: 500, featured: false },
  { id: 3, title: "Lumina Penthouse", location: "Dhanmondi, Dhaka", price: "12,000", period: "day", rating: 5.0, reviews: 56, image: PENT_IMG, type: "Residential", cap: 10, featured: true },
  { id: 4, title: "Skyline Coworking Hub", location: "Banani, Dhaka", price: "4,500", period: "day", rating: 4.7, reviews: 203, image: OFFICE_IMG, type: "Office Space", cap: 30, featured: false },
];

const TYPES = ["All", "Office Space", "Convention Hall", "Residential"];

export default function UserExplorePage() {
  const [activeType, setActiveType] = useState("All");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set([1, 2]));
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = activeType === "All"
    ? PROPERTIES
    : PROPERTIES.filter((p) => p.type === activeType);

  const toggleSave = (id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Premium Search</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Explore Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Find and book verified premium spaces instantly.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-[#111827]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 shadow-sm focus-within:border-blue-500/50 transition-all">
          <Search className="w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search location or space type..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-500 font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#111827]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:border-blue-500/50 transition-all uppercase tracking-wider">
             <SlidersHorizontal className="w-4 h-4" />
             Filters
           </button>
           <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/5">
             <button onClick={() => setView("grid")} className={cn("p-2.5 rounded-lg transition-all", view === "grid" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-gray-400")}>
               <Grid3X3 className="w-4.5 h-4.5" />
             </button>
             <button onClick={() => setView("list")} className={cn("p-2.5 rounded-lg transition-all", view === "list" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-gray-400")}>
               <List className="w-4.5 h-4.5" />
             </button>
           </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={cn(
              "px-5 py-2 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border uppercase tracking-wider",
              activeType === type
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-white dark:bg-[#111827]/60 border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-blue-500/50"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid/List Content */}
      <div className={cn(
        "grid gap-6",
        view === "grid" ? "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filtered.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              layout
            >
              <GlassCard className={cn(
                "group overflow-hidden p-0 bg-white/50 dark:bg-[#111827]/80 backdrop-blur-md border-gray-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 rounded-xl",
                view === "list" ? "p-3" : ""
              )}>
                <div className={cn(
                  "flex min-w-0",
                  view === "list" ? "flex-col gap-5 lg:flex-row lg:items-center" : "flex-col"
                )}>
                {/* Image Section */}
                <div className={cn(
                  "relative overflow-hidden flex-shrink-0 rounded-lg",
                  view === "list" ? "h-56 w-full lg:h-60 lg:w-[330px] xl:w-[380px]" : "h-72 w-full"
                )}>
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={() => toggleSave(property.id)}
                    className={cn(
                      "absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all",
                      savedIds.has(property.id) ? "bg-rose-500 border-rose-500 text-white" : "bg-black/40 border-white/10 text-white hover:text-rose-500"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", savedIds.has(property.id) && "fill-current")} />
                  </button>
                  <div className="absolute top-4 left-4 bg-[#1e293b]/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                     <Building2 className="w-3.5 h-3.5 text-blue-400" />
                     {property.type}
                  </div>
                </div>

                {/* Content Section */}
                <div className={cn(
                  "flex min-w-0 flex-1 flex-col",
                  view === "list" ? "px-2 py-2 lg:px-5 lg:py-3" : "p-7"
                )}>
                  <div>
                     <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                           <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                           <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Verified</span>
                        </div>
                        {property.featured && (
                          <div className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">Featured</div>
                        )}
                     </div>
                     <h3 className={cn("font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors", view === "list" ? "text-2xl" : "text-2xl")}>
                       {property.title}
                     </h3>
                     <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-2">
                       <MapPin className="w-4 h-4 text-blue-500/60" />
                       {property.location}
                     </div>
                  </div>

                  {view === "list" && (
                    <div className="mt-5 grid max-w-lg grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Capacity</p>
                        <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">{property.cap} guests</p>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Reviews</p>
                        <p className="mt-1 text-base font-bold text-gray-900 dark:text-white">{property.reviews}</p>
                      </div>
                    </div>
                  )}

                  <div className={cn(
                    "flex gap-4 border-t border-gray-100 dark:border-white/5",
                    view === "list" ? "mt-5 flex-col pt-5 sm:flex-row sm:items-center sm:justify-between" : "mt-7 items-center justify-between pt-6"
                  )}>
                    <div>
                       <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">৳{property.price}<span className="text-sm font-semibold text-gray-400 ml-1">/ {property.period}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
                         <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                         <span className="text-sm font-bold text-gray-900 dark:text-white">{property.rating}</span>
                      </div>
                      {view === "list" && (
                        <button className="h-11 rounded-xl bg-blue-600 px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-700">
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
