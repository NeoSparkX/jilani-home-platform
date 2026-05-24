"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
});

export async function uploadPropertyImagesToR2(formData: FormData) {
    try {
        const coverFile = formData.get("cover") as File;
        const galleryFiles = formData.getAll("gallery") as File[];

        // Helper function to upload a single file
        const uploadFile = async (file: File, folder: string) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const ext = file.name.split('.').pop();
            const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME!,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
            }));

            return `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;
        };

        // Upload Cover
        const coverUrl = await uploadFile(coverFile, "properties/covers");

        // Upload Gallery in parallel for speed
        const galleryUrls = await Promise.all(
            galleryFiles.map(f => uploadFile(f, "properties/gallery"))
        );

        return { success: true, coverUrl, galleryUrls };
    } catch (error) {
        console.error("R2 Upload Error:", error);
        return { success: false, error: "Failed to upload to Cloudflare R2" };
    }
}