'use client';

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Star, 
  Bookmark, 
  ShieldCheck, 
  Calendar,
  Building2,
  Users,
  Mail,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

const OFFICE_IMG = "https://images.unsplash.com/photo-1640109390671-edce15340659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwb2ZmaWNlJTIwc3BhY2UlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3Nzc3MzE4NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080";
const HALL_IMG = "https://images.unsplash.com/photo-1763231575952-98244918f99b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVudCUyMGhhbGwlMjBlbGVnYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3NzMxODczfDA&ixlib=rb-4.1.0&q=80&w=1080";
const PENT_IMG = "https://images.unsplash.com/photo-1642976975710-1d8890dbf5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZW50aG91c2UlMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc3NzczMTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080";

const INITIAL_SAVED = [
  { 
    id: 1, 
    title: "The Summit Office Tower", 
    location: "Gulshan, Dhaka", 
    rating: 4.9, 
    reviews: 88, 
    image: OFFICE_IMG, 
    type: "OFFICE SPACE", 
    cap: 50, 
    savedDate: "May 20, 2024",
    desc: "Fully furnished tower office with panoramic views. Ideal for corporate teams and long-term rentals.",
    thumbnails: [OFFICE_IMG, HALL_IMG, OFFICE_IMG, PENT_IMG]
  },
  { 
    id: 2, 
    title: "Lumina Penthouse", 
    location: "Dhanmondi, Dhaka", 
    rating: 5.0, 
    reviews: 12, 
    image: PENT_IMG, 
    type: "RESIDENTIAL", 
    cap: 10, 
    savedDate: "June 12, 2024",
    desc: "Ultra-luxury penthouse with private terrace and premium amenities for exclusive stays.",
    thumbnails: [PENT_IMG, OFFICE_IMG, PENT_IMG, HALL_IMG]
  },
];

export default function UserSavedPage() {
  const [items, setItems] = useState(INITIAL_SAVED);
  const remove = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Saved Listings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Manage and view your {items.length} favorite properties.</p>
      </div>

      <div className="flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              layout
              className="w-full"
            >
              <GlassCard className="p-0 bg-[#0B1121] dark:bg-[#0B1121] border-white/5 shadow-2xl rounded-[1.5rem] w-full group hover:border-blue-500/20 transition-all duration-300">
                <div className="flex h-full flex-col gap-6 p-5 xl:flex-row xl:items-stretch">
                  {/* Left: Gallery Section */}
                  <div className="w-full xl:w-[360px] 2xl:w-[400px] flex-shrink-0 space-y-2">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-white/5">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                         <Building2 className="w-3.5 h-3.5 text-blue-400" />
                         <p className="text-[9px] font-bold text-white uppercase tracking-wider">{property.type}</p>
                      </div>
                      <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                         <Bookmark className="w-3 h-3 text-blue-600 fill-blue-600" />
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">SAVED</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {property.thumbnails.map((thumb, idx) => (
                        <div key={idx} className={cn(
                          "aspect-[4/3] rounded-md overflow-hidden border transition-all cursor-pointer",
                          idx === 0 ? "border-blue-500" : "border-white/5 opacity-40 hover:opacity-100"
                        )}>
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Info Section */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                         <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">VERIFIED</span>
                         </div>
                         <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600 text-white border border-blue-500/20">
                            <span className="text-[9px] font-black uppercase tracking-widest">SAVED</span>
                         </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-blue-500 transition-colors">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-bold text-[13px] mb-4">
                        <MapPin className="w-4 h-4 text-blue-500/60" />
                        {property.location}
                      </div>

                      <p className="max-w-3xl text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mb-6 opacity-80">
                        {property.desc}
                      </p>

                      <div className="grid gap-4 border-y border-white/5 py-5 sm:grid-cols-2 xl:max-w-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                              <Users className="w-5 h-5 text-gray-500" />
                           </div>
                           <div>
                              <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{property.cap}</p>
                              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">CAPACITY</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                           </div>
                           <div>
                              <div className="flex items-center gap-1.5">
                                 <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{property.rating}</p>
                                 <span className="text-[9px] font-bold text-gray-500">({property.reviews} REVIEWS)</span>
                              </div>
                              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">RATING</p>
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-gray-500" />
                         </div>
                         <div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">SAVED ON</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{property.savedDate}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                         <button className="flex-1 sm:flex-none h-12 px-6 rounded-xl bg-[#1E293B] hover:bg-blue-600 border border-white/10 flex items-center justify-center gap-2 transition-all group/btn">
                            <Mail className="w-4 h-4 text-white group-hover/btn:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Contact Property</span>
                         </button>
                         <button 
                           onClick={() => remove(property.id)}
                           aria-label={`Remove ${property.title}`}
                           className="w-12 h-12 rounded-xl bg-[#1E293B] hover:bg-red-500/20 border border-white/10 flex flex-shrink-0 items-center justify-center transition-all text-gray-400 hover:text-red-500"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
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
