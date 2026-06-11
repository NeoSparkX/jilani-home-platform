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

interface AdvancedTransactionFilterProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    currentFilters: any;
}

export default function AdvancedTransactionFilter({ isOpen, onClose, onApply, currentFilters }: AdvancedTransactionFilterProps) {
    const [filterCriteria, setFilterCriteria] = useState({
        userName: "",
        gateway: "all",
        status: "all",
        packageName: "",
        promoCode: "",
        minAmount: "",
        maxAmount: "",
        dateFrom: "",
        dateUntil: "",
    });

    useEffect(() => {
        if (isOpen) {
            setFilterCriteria({
                userName: currentFilters?.userName || "",
                gateway: currentFilters?.gateway || "all",
                status: currentFilters?.status || "all",
                packageName: currentFilters?.packageName || "",
                promoCode: currentFilters?.promoCode || "",
                minAmount: currentFilters?.minAmount || "",
                maxAmount: currentFilters?.maxAmount || "",
                dateFrom: currentFilters?.dateFrom || "",
                dateUntil: currentFilters?.dateUntil || "",
            });
        }
    }, [isOpen, currentFilters]);

    const handleApply = () => {
        onApply(filterCriteria);
        onClose();
    };

    const handleClear = () => {
        const cleared = {
            userName: "",
            gateway: "all",
            status: "all",
            packageName: "",
            promoCode: "",
            minAmount: "",
            maxAmount: "",
            dateFrom: "",
            dateUntil: "",
        };
        setFilterCriteria(cleared);
        onApply(cleared); // Instantly apply clear action
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Advanced Filter</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    
                    {/* User Name */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="userName" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">User Name</Label>
                        <Input id="userName" placeholder="e.g. John Doe" value={filterCriteria.userName} onChange={(e) => setFilterCriteria({ ...filterCriteria, userName: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm" />
                    </div>

                    {/* Status */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="status" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Transaction Status</Label>
                        <Select
                            value={filterCriteria.status}
                            onValueChange={(value) => setFilterCriteria({ ...filterCriteria, status: value })}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gateway */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="gateway" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Payment Gateway</Label>
                        <Select
                            value={filterCriteria.gateway}
                            onValueChange={(value) => setFilterCriteria({ ...filterCriteria, gateway: value })}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm">
                                <SelectValue placeholder="Select Gateway" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="bKash">bKash</SelectItem>
                                <SelectItem value="Nagad">Nagad</SelectItem>
                                <SelectItem value="Rocket">Rocket</SelectItem>
                                <SelectItem value="Stripe">Stripe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Package Name */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="packageName" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Package Name</Label>
                        <Input id="packageName" placeholder="e.g. Premium" value={filterCriteria.packageName} onChange={(e) => setFilterCriteria({ ...filterCriteria, packageName: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm" />
                    </div>

                    {/* Promo Code */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="promoCode" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Promo Code</Label>
                        <Input id="promoCode" placeholder="e.g. WINTER20" value={filterCriteria.promoCode} onChange={(e) => setFilterCriteria({ ...filterCriteria, promoCode: e.target.value.toUpperCase() })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 uppercase shadow-sm" />
                    </div>

                    <div className="hidden sm:block col-span-1"></div>

                    {/* Amount Range */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="minAmount" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Min Amount (৳)</Label>
                        <Input id="minAmount" type="number" placeholder="0" value={filterCriteria.minAmount} onChange={(e) => setFilterCriteria({ ...filterCriteria, minAmount: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="maxAmount" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Max Amount (৳)</Label>
                        <Input id="maxAmount" type="number" placeholder="5000" value={filterCriteria.maxAmount} onChange={(e) => setFilterCriteria({ ...filterCriteria, maxAmount: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm" />
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="dateFrom" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Date From</Label>
                        <Input id="dateFrom" type="date" value={filterCriteria.dateFrom} onChange={(e) => setFilterCriteria({ ...filterCriteria, dateFrom: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm [color-scheme:light] dark:[color-scheme:dark]" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="dateUntil" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Date Until</Label>
                        <Input id="dateUntil" type="date" value={filterCriteria.dateUntil} onChange={(e) => setFilterCriteria({ ...filterCriteria, dateUntil: e.target.value })} className="h-11 rounded-xl bg-white dark:bg-slate-950 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm [color-scheme:light] dark:[color-scheme:dark]" />
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
