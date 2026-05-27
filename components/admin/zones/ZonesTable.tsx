"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DUMMY_ZONES = [
  { id: 1, name: "Mirpur 10", name_bn: "মিরপুর ১০", city: "Dhaka", thana: "Mirpur", area: "Section 10", isActive: true },
  { id: 2, name: "Dhanmondi 32", name_bn: "ধানমন্ডি ৩২", city: "Dhaka", thana: "Dhanmondi", area: "Road 32", isActive: true },
  { id: 3, name: "Bosila", name_bn: "বসিলা", city: "Dhaka", thana: "Mohammadpur", area: "Bosila City", isActive: false },
];

export default function ZonesTable() {
  return (
    <GlassCard className="bg-[#0B1121] border-white/5 overflow-hidden p-0">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Zones List</h3>
          <p className="text-xs text-gray-500 mt-1 font-medium">All registered property locations.</p>
        </div>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Zone Name</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">City</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Thana</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Area</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_ZONES.map((zone) => (
              <TableRow key={zone.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium text-white">
                  {zone.name}
                  <div className="text-xs text-gray-500 font-normal">{zone.name_bn}</div>
                </TableCell>
                <TableCell className="text-gray-400">{zone.city}</TableCell>
                <TableCell className="text-gray-400">{zone.thana}</TableCell>
                <TableCell className="text-gray-400">{zone.area || "-"}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    zone.isActive 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                  )}>
                    {zone.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0B1121] border-white/10 text-white">
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 focus:text-white cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 focus:text-white text-rose-500 focus:text-rose-500 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassCard>
  );
}
