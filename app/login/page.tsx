"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User logged in:", session?.user);
      router.push("/");
    }
    if (status === "unauthenticated") {
      console.log("No user logged in");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[color:var(--color-background)]">
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="text-3xl px-5 py-4 tracking-wider font-extrabold border hover:text-white hover:bg-black border-amber-300 rounded-md cursor-pointer bg-amber-400 text-black hover:shadow-lg transition"
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;