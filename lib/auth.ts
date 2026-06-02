import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, or, and, gte } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    // adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    providers: [

        // --- 1. GOOGLE OAUTH ---
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),

        // --- 2 & 3. PASSWORD LOGIN (EMAIL OR PHONE) ---
        Credentials({
            id: "password-login",
            name: "Password",
            credentials: {
                identifier: { label: "Email or Phone Number", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) return null;

                const identifierStr = credentials.identifier as string;

                // Search database for the user by matching EITHER email or phone number
                const [user] = await db
                    .select()
                    .from(users)
                    .where(
                        or(
                            eq(users.email, identifierStr),
                            eq(users.phoneNumber, identifierStr)
                        )
                    );

                if (!user || !user.password) return null;

                // 🚨 BLOCK DELETED USERS
                if (user.deletedAt !== null) {
                    throw new Error("This account has been deactivated or deleted.");
                }

                // Verify the hashed password
                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (isPasswordValid) return user;
                return null;
            },
        }),

        // --- 4. PHONE OTP LOGIN ---
        Credentials({
            id: "phone-otp",
            name: "PhoneOTP",
            credentials: {
                phoneNumber: { label: "Phone Number", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.phoneNumber || !credentials?.otp) return null;

                // Verify token exists, matches phone, and is not expired
                const [tokenRecord] = await db
                    .select()
                    .from(verificationTokens)
                    .where(
                        and(
                            eq(verificationTokens.identifier, credentials.phoneNumber as string),
                            eq(verificationTokens.token, credentials.otp as string),
                            gte(verificationTokens.expires, new Date())
                        )
                    );

                if (!tokenRecord) return null;

                // Delete token to prevent replay attacks
                await db
                    .delete(verificationTokens)
                    .where(eq(verificationTokens.identifier, credentials.phoneNumber as string));

                // Find or create user
                let [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.phoneNumber, credentials.phoneNumber as string));

                if (!user) {
                    [user] = await db
                        .insert(users)
                        .values({ phoneNumber: credentials.phoneNumber as string })
                        .returning();
                }

                // 🚨 BLOCK DELETED USERS
                if (user.deletedAt !== null) {
                    throw new Error("This account has been deactivated or deleted.");
                }

                return user;
            },
        }),

        // --- 5. EMAIL OTP LOGIN ---
        Credentials({
            id: "email-otp",
            name: "EmailOTP",
            credentials: {
                email: { label: "Email", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.otp) return null;

                // Verify token exists, matches email, and is not expired
                const [tokenRecord] = await db
                    .select()
                    .from(verificationTokens)
                    .where(
                        and(
                            eq(verificationTokens.identifier, credentials.email as string),
                            eq(verificationTokens.token, credentials.otp as string),
                            gte(verificationTokens.expires, new Date())
                        )
                    );

                if (!tokenRecord) return null;

                // Delete token to prevent replay attacks
                await db
                    .delete(verificationTokens)
                    .where(eq(verificationTokens.identifier, credentials.email as string));

                // Find or create user based on email
                let [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email as string));

                if (!user) {
                    [user] = await db
                        .insert(users)
                        .values({ email: credentials.email as string })
                        .returning();
                }

                // 🚨 BLOCK DELETED USERS
                if (user.deletedAt !== null) {
                    throw new Error("This account has been deactivated or deleted.");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        // 1. SIGN IN INTERCEPTOR
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                if (!user.email) return false;

                const [existingUser] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, user.email));

                if (existingUser) {
                    // 🚨 If the user exists AND has a deletedAt timestamp, block the login
                    if (existingUser.deletedAt !== null) {
                        return false; // Returning false immediately redirects them to an "Access Denied" error page
                    }
                } else {
                    await db.insert(users).values({
                        id: crypto.randomUUID(), // Creates the Postgres UUID
                        name: user.name || "Google User",
                        email: user.email,
                        role: 'user',
                    });
                }
            }

            return true;
        },


        // 2. JWT SESSION BUILDER
        async jwt({ token, user, trigger, session, account }) {
            // 'account' and 'user' are ONLY present on the very first login request
            if (account && user) {
                if (account.provider === "google") {
                    // Force the token to use the Database UUID, not the Google ID
                    const [dbUser] = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, user.email as string));

                    // 🚨 1. BLOCK INITIAL LOGIN FOR DELETED GOOGLE USERS
                    if (dbUser && dbUser.deletedAt !== null) {
                        throw new Error("This account has been deactivated.");
                    }

                    if (dbUser) {
                        token.id = dbUser.id;
                        token.phoneNumber = dbUser.phoneNumber;
                        token.role = dbUser.role;
                    }
                } else {
                    // For Credentials provider (Email/Phone + Password)
                    // (Assuming you already check deletedAt inside your authorize() function)
                    token.id = user.id;
                    token.phoneNumber = user.phoneNumber;
                    token.role = user.role;
                }
            }

            // Handle the manual session update from the Onboarding page
            if (trigger === "update" && session?.phoneNumber) {
                token.phoneNumber = session.phoneNumber;
            }

            // 🚨 2. INSTANTLY KICK OUT ACTIVE USERS IF DELETED MID-SESSION
            // This runs on subsequent requests. We check if they were deleted while logged in.
            if (token?.id) {
                const [currentUser] = await db
                    .select({ deletedAt: users.deletedAt }) // Only fetch what we need for performance
                    .from(users)
                    .where(eq(users.id, token.id));

                // If the user doesn't exist anymore or was soft-deleted, destroy the token
                if (!currentUser || currentUser.deletedAt !== null) {
                    return null; // Returning null instantly logs the user out
                }
            }

            return token;
        },

        // 3. PASS TO BROWSER
        async session({ session, token }) {
            // 🚨 Prevent mapping if the token was destroyed (user was deleted)
            if (!token?.id) {
                return session; // Returns unauthenticated state
            }

            if (token && session.user) {
                // Map our custom token data into the final session object
                session.user.id = token.id;
                session.user.phoneNumber = token.phoneNumber;
                session.user.role = token.role;
            }
            return session;
        },
    }
});