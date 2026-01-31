import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import PromotionTerminal from "@/components/site/User/PromotionTerminal";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const page = async () => {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!role) {
    redirect("/auth");
  }

  return (
    <div>
      <PromotionTerminal />
    </div>
  );
};

export default page;
