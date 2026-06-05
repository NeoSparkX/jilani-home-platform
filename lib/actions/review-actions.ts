"use server";

import { db } from "@/lib/db";
import { propertyReviews, properties, users, unlocks } from "@/lib/db/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// 1. Submit or Edit Review
export async function submitReview(propertyId: string, rating: number, message: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "UNAUTHORIZED" };
        const userId = session.user.id;

        // NEW: 1. Verify the user has actually unlocked this property
        const hasUnlocked = await db.select()
            .from(unlocks) // Use your actual table name here
            .where(
                and(
                    eq(unlocks.userId, userId),
                    eq(unlocks.propertyId, propertyId)
                )
            )
            .limit(1);

        if (hasUnlocked.length === 0) {
            return {
                success: false,
                error: "FORBIDDEN",
                message: "You must unlock this property's contact info before leaving a review."
            };
        }

        // Auto-detect phone numbers (BD) and emails to prevent leaks
        const containsContactInfo = /[\w.-]+@[\w.-]+\.\w+|(\+88)?01[3-9]\d{8}/.test(message);
        const reviewStatus = containsContactInfo ? 'rejected' : 'pending';

        // Run in a transaction so rating averages are perfectly accurate
        await db.transaction(async (tx) => {
            // A. Upsert the review (Insert if new, Update if editing)
            await tx.insert(propertyReviews)
                .values({ propertyId, userId, rating, message, status: reviewStatus })
                .onConflictDoUpdate({
                    target: [propertyReviews.userId, propertyReviews.propertyId],
                    set: { rating, message, status: reviewStatus, updatedAt: new Date() }
                });

            // B. Recalculate average instantly!
            const stats = await tx.select({
                avg: sql<number>`COALESCE(AVG(${propertyReviews.rating}), 0)`,
                total: sql<number>`COUNT(${propertyReviews.id})`
            })
                .from(propertyReviews)
                .where(eq(propertyReviews.propertyId, propertyId));

            // C. Update the property table
            await tx.update(properties)
                .set({
                    averageRating: Number(stats[0].avg).toFixed(2),
                    totalReviews: Number(stats[0].total)
                })
                .where(eq(properties.id, propertyId));
        });

        revalidatePath(`/listings`);
        return {
            success: true,
            message: reviewStatus === 'rejected'
                ? "Review flagged for containing contact info."
                : "Rating updated! Message is pending approval."
        };
    } catch (error) {
        console.error(error);
        return { success: false, error: "DATABASE_ERROR" };
    }
}


// 2. Fetch Reviews with Sorting
export async function getPropertyReviews(propertyId: string, sortBy: 'newest' | 'oldest' | 'highest' | 'lowest') {
    try {
        const session = await auth();
        const currentUserId = session?.user?.id;

        let orderByQuery = desc(propertyReviews.createdAt);
        if (sortBy === 'oldest') orderByQuery = asc(propertyReviews.createdAt);
        if (sortBy === 'highest') orderByQuery = desc(propertyReviews.rating);
        if (sortBy === 'lowest') orderByQuery = asc(propertyReviews.rating);

        const data = await db
            .select({
                id: propertyReviews.id,
                rating: propertyReviews.rating,
                message: propertyReviews.message,
                status: propertyReviews.status,
                createdAt: propertyReviews.createdAt,
                userId: propertyReviews.userId,
                userName: users.name, // Join user data
                userImage: users.image,
            })
            .from(propertyReviews)
            .leftJoin(users, eq(propertyReviews.userId, users.id)) // LEFT JOIN because user might be deleted!
            .where(eq(propertyReviews.propertyId, propertyId))
            .orderBy(orderByQuery);

        // Sanitize messages: Only show approved messages, UNLESS it's the current user's own review
        const sanitizedData = data.map(r => ({
            ...r,
            // If user is deleted, replace their name
            userName: r.userName || 'Jilani Home User',
            message: (r.status === 'approved' || r.userId === currentUserId) ? r.message : null,
            isOwnReview: r.userId === currentUserId
        }));

        return { success: true, data: sanitizedData };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function checkUserUnlockedProperty(propertyId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return false;

        const hasUnlocked = await db.select()
            .from(unlocks)
            .where(
                and(
                    eq(unlocks.userId, session.user.id),
                    eq(unlocks.propertyId, propertyId)
                )
            )
            .limit(1);

        return hasUnlocked.length > 0;
    } catch (error) {
        return false;
    }
}