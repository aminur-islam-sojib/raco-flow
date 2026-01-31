import { HeroSection } from "@/components/site/Hero/HeroSection";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const user = await getServerSession(authOptions);
  console.log(user);
  return (
    <>
      <HeroSection />
    </>
  );
}
