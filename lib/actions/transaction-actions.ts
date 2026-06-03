"use server";

import { db } from "@/lib/db";
import { transactions, users, pointPackages, promoCodes } from "@/lib/db/schema";
import { eq, desc, asc, or, ilike, and, gte, lte, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function fetchTransactions(page: number, limit: number = 10, search = "", sortKey = "createdAt", sortOrder = "desc", filters: any = null) {
    const offset = (page - 1) * limit;

    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "admin") {
            throw new Error("Unauthorized access");
        }

        const conditions = [];

        // Search by Trx ID (gatewayTrxId)
        if (search.trim() !== "") {
            conditions.push(ilike(transactions.gatewayTrxId, `%${search.trim()}%`));
        }

        // Advanced Filters
        if (filters) {
            if (filters.userName) {
                conditions.push(ilike(users.name, `%${filters.userName}%`));
            }
            if (filters.gateway && filters.gateway !== "all") {
                conditions.push(eq(transactions.gateway, filters.gateway));
            }
            if (filters.status && filters.status !== "all") {
                conditions.push(eq(transactions.status, filters.status));
            }
            if (filters.packageName) {
                conditions.push(ilike(pointPackages.name, `%${filters.packageName}%`));
            }
            if (filters.promoCode) {
                conditions.push(ilike(promoCodes.code, `%${filters.promoCode}%`));
            }
            if (filters.minAmount) {
                conditions.push(gte(transactions.amountPaid, filters.minAmount));
            }
            if (filters.maxAmount) {
                conditions.push(lte(transactions.amountPaid, filters.maxAmount));
            }
            if (filters.dateFrom) {
                conditions.push(gte(transactions.createdAt, new Date(filters.dateFrom)));
            }
            if (filters.dateUntil) {
                const checkDate = new Date(filters.dateUntil);
                checkDate.setHours(23, 59, 59, 999);
                conditions.push(lte(transactions.createdAt, checkDate));
            }
        }

        const finalCondition = conditions.length > 0 ? and(...conditions) : undefined;

        let orderByColumn: any;
        if (sortKey === 'gatewayTrxId') orderByColumn = transactions.gatewayTrxId;
        else if (sortKey === 'status') orderByColumn = transactions.status;
        else if (sortKey === 'amountPaid') orderByColumn = transactions.amountPaid;
        else if (sortKey === 'pointsCredited') orderByColumn = transactions.pointsCredited;
        else orderByColumn = transactions.createdAt;

        const order: any = sortOrder === "desc" ? desc(orderByColumn) : asc(orderByColumn);

        const data = await db
            .select({
                id: transactions.id,
                originalAmount: transactions.originalAmount,
                discountAmount: transactions.discountAmount,
                amountPaid: transactions.amountPaid,
                pointsCredited: transactions.pointsCredited,
                gateway: transactions.gateway,
                gatewayTrxId: transactions.gatewayTrxId,
                status: transactions.status,
                createdAt: transactions.createdAt,
                
                userName: users.name,
                userEmail: users.email,
                
                packageName: pointPackages.name,
                
                promoCode: promoCodes.code,
            })
            .from(transactions)
            .leftJoin(users, eq(transactions.userId, users.id))
            .leftJoin(pointPackages, eq(transactions.packageId, pointPackages.id))
            .leftJoin(promoCodes, eq(transactions.promoCodeId, promoCodes.id))
            .where(finalCondition)
            .limit(limit + 1)
            .orderBy(order)
            .offset(offset);

        const hasMore = data.length > limit;
        const dataToReturn = hasMore ? data.slice(0, -1) : data;

        return { data: dataToReturn, hasMore };
    } catch (error) {
        console.error("Database error in fetchTransactions:", error);
        throw new Error("Failed to fetch data");
    }
}
