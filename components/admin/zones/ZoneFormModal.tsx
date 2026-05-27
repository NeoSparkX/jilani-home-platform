"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function ZoneFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#0B1121] border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Zone</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="name" className="text-gray-400">Zone Name</Label>
            <Input id="name" placeholder="Mirpur 10" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="name_bn" className="text-gray-400">Zone Name (Bengali)</Label>
            <Input id="name_bn" placeholder="মিরপুর ১০" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="city" className="text-gray-400">City / District</Label>
            <Input id="city" placeholder="Dhaka" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="city_bn" className="text-gray-400">City (Bengali)</Label>
            <Input id="city_bn" placeholder="ঢাকা" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="thana" className="text-gray-400">Thana / Upazila</Label>
            <Input id="thana" placeholder="Mirpur" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="thana_bn" className="text-gray-400">Thana (Bengali)</Label>
            <Input id="thana_bn" placeholder="মিরপুর" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="area" className="text-gray-400">Area</Label>
            <Input id="area" placeholder="Block C" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <Label htmlFor="area_bn" className="text-gray-400">Area (Bengali)</Label>
            <Input id="area_bn" placeholder="ব্লক সি" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Zone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
