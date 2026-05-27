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

const DUMMY_OWNERS = [
  { id: "1", name: "Rahim Uddin", name_bn: "রহিম উদ্দিন", phone: "+8801711000000", whatsapp: "+8801711000000", updatedAt: "2024-05-09" },
  { id: "2", name: "Karim Ali", name_bn: "করিম আলী", phone: "+8801811000000", whatsapp: "", updatedAt: "2024-05-08" },
  { id: "3", name: "Jabbar Mia", name_bn: "জব্বার মিয়া", phone: "+8801911000000", whatsapp: "+8801911000000", updatedAt: "2024-05-07" },
];

export default function OwnersTable() {
  return (
    <GlassCard className="bg-[#0B1121] border-white/5 overflow-hidden p-0">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Owners List</h3>
          <p className="text-xs text-gray-500 mt-1 font-medium">All registered property owners.</p>
        </div>
      </div>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Name</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Name (BN)</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Phone</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">WhatsApp</TableHead>
              <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Last Updated</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DUMMY_OWNERS.map((owner) => (
              <TableRow key={owner.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium text-white">{owner.name}</TableCell>
                <TableCell className="text-gray-400">{owner.name_bn}</TableCell>
                <TableCell className="text-gray-400">{owner.phone}</TableCell>
                <TableCell className="text-gray-400">{owner.whatsapp || "-"}</TableCell>
                <TableCell className="text-gray-400">{owner.updatedAt}</TableCell>
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
