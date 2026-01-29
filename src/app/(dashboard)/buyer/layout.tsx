import React from "react";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pt-24 px-4">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
