import { Elysia, t } from "elysia";
import { put } from "@vercel/blob";

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export const uploadController = new Elysia({ prefix: "/upload" })
  .post("/", async ({ body, set }) => {
    const { file } = body;

    if (!blobToken) {
      console.error("❌ BLOB_READ_WRITE_TOKEN is not configured.");
      set.status = 500;
      return { error: "Blob storage token not configured" };
    }

    try {
      // Generate a unique filename using timestamp
      const uniqueFilename = `${Date.now()}-${file.name}`;
      
      // Convert File payload to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Vercel Blob
      const blob = await put(uniqueFilename, buffer, {
        access: "public",
        token: blobToken,
      });

      console.log(`✅ File uploaded successfully to Vercel Blob: ${blob.url}`);
      return {
        success: true,
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
      };
    } catch (error) {
      console.error("❌ Vercel Blob upload failed:", error);
      set.status = 500;
      return { error: "Failed to upload file to storage" };
    }
  }, {
    body: t.Object({
      file: t.File({
        maxSize: 1024 * 1024 * 5, // Limit files to 5MB max
      })
    })
  });
