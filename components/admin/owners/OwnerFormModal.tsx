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

export default function OwnerFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Owner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0B1121] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Owner</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-400">Name</Label>
            <Input id="name" placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name_bn" className="text-gray-400">Name (Bengali)</Label>
            <Input id="name_bn" placeholder="জন ডো" className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-400">Phone</Label>
            <Input id="phone" placeholder="+8801..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-gray-400">WhatsApp</Label>
            <Input id="whatsapp" placeholder="+8801..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-600" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Owner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
