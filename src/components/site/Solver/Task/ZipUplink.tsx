"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "react-hot-toast";

async function saveUrlToTask(taskId: string, fileUrl: string) {
  console.log("taskid", taskId);
  console.log("fileUrl", fileUrl);
  try {
    const response = await fetch("/api/task/submit", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, submissionUrl: fileUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save submission");
    }

    const data = await response.json();
    toast.success(data.message || "Package Deployed Successfully");
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(`Deployment Failed: ${errorMessage}`);
    throw error;
  }
}

export function ZipUplink({ taskId }: { taskId: string }) {
  return (
    <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
      <UploadDropzone
        endpoint="zipUploader"
        input={{}}
        onClientUploadComplete={(res) => {
          console.log("Upload successful:", res);
          const fileUrl = res[0].url;
          const fileName = res[0].name;

          // Verify file extension on client side
          if (!fileName.toLowerCase().endsWith(".zip")) {
            toast.error("Invalid file type. Only .zip files are allowed.");
            return;
          }

          saveUrlToTask(taskId, fileUrl);
          toast.success("Transmission Received: ZIP Encrypted");
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          toast.error(`Uplink Failed: ${error.message}`);
        }}
        appearance={{
          button: "bg-cyan-600 hover:bg-cyan-500 text-sm font-mono uppercase",
          container: "border-cyan-900/50 bg-slate-950",
          label: "text-cyan-400 hover:text-cyan-300",
        }}
        content={{
          label: "DRAG MISSION DATA (ZIP ONLY)",
          allowedContent: "ZIP files only (Max 16MB)",
        }}
      />
    </div>
  );
}
