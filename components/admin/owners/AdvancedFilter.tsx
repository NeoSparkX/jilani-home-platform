"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdvancedFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    currentFilters: any;
}

export default function AdvancedFilter({ isOpen, onClose, onApply, currentFilters }: AdvancedFilterModalProps) {
    const [filterCriteria, setFilterCriteria] = useState({
        name: "",
        phone: "",
    });

    useEffect(() => {
        if (isOpen) {
            setFilterCriteria({
                name: currentFilters?.name || "",
                phone: currentFilters?.phone || "",
            });
        }
    }, [isOpen, currentFilters]);

    const handleApply = () => {
        onApply(filterCriteria);
        onClose();
    };

    const handleClear = () => {
        const cleared = { name: "", phone: "" };
        setFilterCriteria(cleared);
        onApply(cleared); // Instantly apply clear action
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Advanced Filter</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">

                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="name" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Owner Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. John Doe"
                            value={filterCriteria.name}
                            onChange={(e) => setFilterCriteria({ ...filterCriteria, name: e.target.value })}
                            className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                        />
                    </div>

                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="phone" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Phone Number</Label>
                        <Input
                            id="phone"
                            placeholder="017XXXXXXXX"
                            value={filterCriteria.phone}
                            onChange={(e) => setFilterCriteria({ ...filterCriteria, phone: e.target.value })}
                            className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                    <Button type="button" variant="outline" onClick={handleClear} className="rounded-xl font-bold bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Clear
                    </Button>
                    <Button type="button" onClick={handleApply} className="rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        Apply
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
