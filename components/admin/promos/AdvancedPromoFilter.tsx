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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedPromoFilterProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    currentFilters: any;
}

export default function AdvancedPromoFilter({ isOpen, onClose, onApply, currentFilters }: AdvancedPromoFilterProps) {
    const [filterCriteria, setFilterCriteria] = useState({
        isActive: undefined as boolean | undefined,
        discountType: "all",
        minAmount: "",
        maxAmount: "",
        validUntil: "",
    });

    useEffect(() => {
        if (isOpen) {
            setFilterCriteria({
                isActive: currentFilters?.isActive,
                discountType: currentFilters?.discountType || "all",
                minAmount: currentFilters?.minAmount || "",
                maxAmount: currentFilters?.maxAmount || "",
                validUntil: currentFilters?.validUntil || "",
            });
        }
    }, [isOpen, currentFilters]);

    const handleApply = () => {
        onApply(filterCriteria);
        onClose();
    };

    const handleClear = () => {
        const cleared = {
            isActive: undefined,
            discountType: "all",
            minAmount: "",
            maxAmount: "",
            validUntil: "",
        };
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
                    
                    {/* Status */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="isActive" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Status</Label>
                        <Select
                            value={filterCriteria.isActive === undefined ? "all" : filterCriteria.isActive ? "active" : "inactive"}
                            onValueChange={(value) => setFilterCriteria({ ...filterCriteria, isActive: value === "all" ? undefined : value === "active" })}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Discount Type */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="discountType" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Discount Type</Label>
                        <Select
                            value={filterCriteria.discountType}
                            onValueChange={(value) => setFilterCriteria({ ...filterCriteria, discountType: value })}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount Range */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="minAmount" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Min Discount Amount</Label>
                        <Input id="minAmount" type="number" placeholder="0" value={filterCriteria.minAmount} onChange={(e) => setFilterCriteria({ ...filterCriteria, minAmount: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="maxAmount" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Max Discount Amount</Label>
                        <Input id="maxAmount" type="number" placeholder="1000" value={filterCriteria.maxAmount} onChange={(e) => setFilterCriteria({ ...filterCriteria, maxAmount: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm" />
                    </div>

                    {/* Validity Range */}
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="validUntil" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Valid Until</Label>
                        <Input id="validUntil" type="date" value={filterCriteria.validUntil} onChange={(e) => setFilterCriteria({ ...filterCriteria, validUntil: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm [color-scheme:light] dark:[color-scheme:dark]" />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
                    <Button type="button" variant="outline" onClick={handleClear} className="rounded-xl font-bold bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Clear
                    </Button>
                    <Button type="button" onClick={handleApply} className="rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        Apply Filter
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
