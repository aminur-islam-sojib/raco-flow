import { NoSubmissions } from "@/components/site/Buyer/NoSubmissions";
import { ProjectCard2 } from "@/components/site/Buyer/ProjectCard2";
import { getBuyerSubmissions } from "@/services/buyerService";

export default async function page() {
  // Call the service directly on the server so getServerSession() can access cookies
  try {
    const submissions = await getBuyerSubmissions();
    console.log("✅ Submissions fetched:", submissions);
    return (
      <div>
        {submissions && submissions.length > 0 ? (
          submissions.map((project, index) => (
            <ProjectCard2 project={project} index={index} key={index} />
          ))
        ) : (
          <NoSubmissions />
        )}
      </div>
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Buyer Submissions Error:", errorMsg);
    return (
      <div style={{ color: "red", padding: "20px" }}>Error: {errorMsg}</div>
    );
  }
}
