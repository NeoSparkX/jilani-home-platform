import { S3Client } from "@aws-sdk/client-s3";

// 1. Safety check to ensure your .env variables are loaded
if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_S3_ENDPOINT) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
        console.warn("⚠️ Missing Cloudflare R2 environment variables. Check your environment settings.");
    }
}

// 2. Initialize the S3 Client for Cloudflare R2
export const s3Client = new S3Client({
    region: "auto", // Cloudflare R2 always uses "auto" for region
    endpoint: process.env.R2_S3_ENDPOINT || "https://placeholder.r2.cloudflarestorage.com",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "placeholder",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "placeholder",
    },
});