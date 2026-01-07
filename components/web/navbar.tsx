"use client";

import Link from "next/link";

import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SearchInput from "./searchInput";

const Navbar = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <nav className="flex i-center justify-between py-5">
      <div className="flex gap-8 items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            <Link href={"/"} >ASYNC</Link>
          </h1>
        </div>

        <div className="flex gap-4">
          <Link href="/" className={buttonVariants({ variant: "ghost" })}>
            Home
          </Link>
          <Link href="/blogs" className={buttonVariants({ variant: "ghost" })}>
            Blogs
          </Link>
          <Link href="/create" className={buttonVariants({ variant: "ghost" })}>
            Create
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        <SearchInput/>
        {isLoading ? null : isAuthenticated ? (
          <Button
            onClick={() => {
              startTransition(async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Signed out successfully");
                      router.push("/auth/sign-in");
                    },
                    onError: (err) => {
                      toast.error(err.error.message);
                    },
                  },
                });
              });
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Loading...
              </>
            ) : (
              "Log Out"
            )}
          </Button>
        ) : (
          <>
            <Link href={"/auth/sign-in"} className={buttonVariants()}>
              Login
            </Link>
            <Link
              href={"/auth/sign-up"}
              className={buttonVariants({ variant: "outline" })}
            >
              Sign up
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
