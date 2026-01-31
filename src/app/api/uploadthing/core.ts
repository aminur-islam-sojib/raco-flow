import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  // Define a unique endpoint for task submissions
  // Accept only ZIP files with proper MIME type validation
  zipUploader: f({
    blob: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        // Optional: You can add input validation here if needed
      }),
    )
    .middleware(async () => {
      console.log("🔍 UploadThing Middleware - Starting");

      try {
        const session = await getServerSession(authOptions);
        console.log(
          "✅ Session retrieved:",
          session ? "Session exists" : "No session",
        );
        console.log("👤 User role:", session?.user?.role);
        console.log("🆔 User ID:", session?.user?.id);

        // Role Enforcement: Only Solvers can upload
        if (!session || session?.user?.role !== "solver") {
          console.error("❌ Authorization failed - No session or not a solver");
          console.error("Session:", session);
          throw new Error("Unauthorized: Only solvers can upload files");
        }

        console.log("✅ Authorization successful");
        return { userId: session.user.id };
      } catch (error) {
        console.error("💥 Error in UploadThing middleware:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      console.log("File name:", file.name);
      console.log("File type:", file.type);

      // Validate that the uploaded file is actually a ZIP file
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      // Check file extension
      if (!fileName.endsWith(".zip")) {
        throw new Error(
          `Invalid file type: ${fileName}. Only .zip files are allowed.`,
        );
      }

      // Check MIME type
      if (
        fileType !== "application/zip" &&
        fileType !== "application/x-zip-compressed"
      ) {
        throw new Error(
          `Invalid MIME type: ${fileType}. Only application/zip is allowed.`,
        );
      }

      // This URL is what you will save in your MongoDB Subtasks collection
      return {
        uploadedBy: metadata.userId,
        url: file.url,
        fileName: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
