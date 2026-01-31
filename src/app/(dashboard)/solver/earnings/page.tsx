import EarningsIntelligencePage from "@/components/site/Solver/Earnings/EarningsIntelligencePage";
import { getSolverCompletedEarnings } from "@/services/solverService";

export default async function page() {
  const completedData = await getSolverCompletedEarnings();
  console.log(completedData);
  return (
    <div>
      <EarningsIntelligencePage />
    </div>
  );
}
