"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Loader2,
  ArrowDownUp,
  ArrowDownAZ,
  ArrowUpAZ,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import AdvancedTransactionFilter from "./AdvancedTransactionFilter";
import { fetchTransactions } from "@/lib/actions/transaction-actions";
import { cn } from "@/lib/utils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TransactionInvoicePDF } from "./TransactionInvoicePDF";

interface ClientDataListProps {
  initialData: any[];
  limit: number;
  hasMore: boolean;
}

export default function TransactionsClient({ initialData, limit, hasMore }: ClientDataListProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("createdAt");

  const [transactions, setTransactions] = useState(initialData);
  const [hasMoreData, setHasMoreData] = useState(hasMore);
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
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

  // SERVER-SIDE SEARCH (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Avoid initial double fetch if nothing changed
      if (search === "" && currentPage === 1 && transactions === initialData && Object.values(activeFilters).every(v => v === "" || v === undefined || v === "all")) return;

      setIsLoading(true);
      const result = await fetchTransactions(1, limit, search, sortKey, sortOrder, activeFilters);

      setTransactions(result.data || []);
      setHasMoreData(result.hasMore || false);
      setCurrentPage(1);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, limit]);

  // PAGINATION HANDLERS
  const handleNext = async () => {
    if (!hasMoreData || isLoading) return;
    setIsLoading(true);
    const nextPage = currentPage + 1;

    const result = await fetchTransactions(nextPage, limit, search, sortKey, sortOrder, activeFilters);

    setTransactions(result.data || []);
    setHasMoreData(result.hasMore || false);
    setCurrentPage(nextPage);
    setIsLoading(false);
  };

  const handlePrev = async () => {
    if (currentPage <= 1 || isLoading) return;
    setIsLoading(true);
    const prevPage = currentPage - 1;

    const result = await fetchTransactions(prevPage, limit, search, sortKey, sortOrder, activeFilters);

    setTransactions(result.data || []);
    setHasMoreData(result.hasMore || false);
    setCurrentPage(prevPage);
    setIsLoading(false);
  };

  // HANDLE SORTING
  const handleSort = async (sortKey: string) => {
    if (isLoading) return;

    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    setSortKey(sortKey);

    setIsLoading(true);
    const result = await fetchTransactions(currentPage, limit, search, sortKey, newSortOrder, activeFilters);
    setTransactions(result.data || []);
    setHasMoreData(result.hasMore || false);
    setIsLoading(false);
  };

  const handleApplyFilter = async (filters: any) => {
    setActiveFilters(filters);
    setIsLoading(true);
    const result = await fetchTransactions(1, limit, search, sortKey, sortOrder, filters);
    setTransactions(result.data || []);
    setHasMoreData(result.hasMore || false);
    setCurrentPage(1);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-[0.15em] text-blue-600 dark:text-blue-400 uppercase">Financials</p>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base">View and filter user point purchases.</p>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Transaction ID..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 font-medium"
          />
          {isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold transition-all cursor-pointer"
        >
          <Filter className="w-5 h-5" />
          Advanced Filter
          {Object.values(activeFilters).some(v => v !== "" && v !== undefined && v !== "all") && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] ml-1">
              {Object.values(activeFilters).filter(v => v !== "" && v !== undefined && v !== "all").length}
            </span>
          )}
        </button>

        <AdvancedTransactionFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilter}
          currentFilters={activeFilters}
        />
      </div>

      {/* Table Card */}
      <GlassCard className="p-0 overflow-hidden bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5 shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  Transaction
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  User
                </th>
                <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  Package
                </th>
                <th onClick={() => handleSort("amountPaid")} className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  <span className="flex items-center gap-2 cursor-pointer">
                    Amount {sortKey !== "amountPaid" ? <ArrowDownUp className="w-3.5 h-3.5 opacity-30" /> : sortOrder === "desc" ? <ArrowDownAZ className="w-3.5 h-3.5" /> : <ArrowUpAZ className="w-3.5 h-3.5" />}
                  </span>
                </th>
                <th onClick={() => handleSort("status")} className="px-8 py-5 text-left text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  <span className="flex items-center gap-2 cursor-pointer">
                    Status {sortKey !== "status" ? <ArrowDownUp className="w-3.5 h-3.5 opacity-30" /> : sortOrder === "desc" ? <ArrowDownAZ className="w-3.5 h-3.5" /> : <ArrowUpAZ className="w-3.5 h-3.5" />}
                  </span>
                </th>
                <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {transactions.map((trx, i) => (
                <motion.tr
                  key={trx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoading ? 0.5 : 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{trx.gatewayTrxId || 'N/A'}</p>
                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                          {new Date(trx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{trx.userName || 'N/A'}</p>
                    <p className="text-[11px] font-bold text-gray-400 mt-0.5">{trx.userEmail || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{trx.packageName || 'Unknown'}</p>
                    <p className="text-[11px] font-bold text-gray-400 mt-0.5">{trx.pointsCredited} Pts</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      {Number(trx.discountAmount) > 0 ? (
                        <>
                          <p className="text-[11px] font-bold text-gray-400 line-through">৳ {Number(trx.originalAmount).toFixed(2)}</p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">৳ {Number(trx.amountPaid).toFixed(2)}</p>
                          {trx.promoCode && (
                            <span className="inline-flex self-start mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                              {trx.promoCode} (-৳{Number(trx.discountAmount).toFixed(2)})
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-bold text-gray-900 dark:text-white">৳ {Number(trx.amountPaid).toFixed(2)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm",
                      trx.status === 'success' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20" :
                      trx.status === 'failed' ? "text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-500/20" :
                      "text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20"
                    )}>
                      {trx.status === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                       trx.status === 'failed' ? <XCircle className="w-3.5 h-3.5" /> :
                       <Clock className="w-3.5 h-3.5" />}
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {isMounted && (
                      <PDFDownloadLink
                        document={<TransactionInvoicePDF transaction={trx} />}
                        fileName={`invoice-${trx.gatewayTrxId || trx.id.substring(0, 8)}.pdf`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {/* 
                          Since PDFDownloadLink uses a render prop, we can show a loading state, 
                          but standard child text works fine for simple use cases. 
                        */}
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </PDFDownloadLink>
                    )}
                  </td>
                </motion.tr>
              ))}
              {transactions.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-500">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-5 bg-gray-50 dark:bg-white/5 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Page {currentPage}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={!hasMoreData || isLoading}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-white/10 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
