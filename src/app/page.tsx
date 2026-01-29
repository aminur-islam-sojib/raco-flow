import { HeroSection } from "@/components/site/Hero/HeroSection";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const role = await getServerSession(authOptions);
  console.log(role);
  return (
    <>
      <HeroSection />
    </>
  );
}
