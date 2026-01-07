import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Async | Login or sign up to get started",
  description: "Login or sign up to get started",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="absolute top-5 left-5">
        <Link href={"/"} className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft size={24} />
          Go Back
        </Link>
      </div>
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
}
