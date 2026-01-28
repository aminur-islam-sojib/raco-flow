// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GoogleButton } from "../GoogleButton";
import { InputGroup } from "../InputGroup";
import { SocialSeparator } from "../SocialSeparator";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Handle form submission
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.status == 200) {
        console.log("Login Successful!");
      } else if (result?.status == 401) {
        console.log(`${result?.error}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="space-y-2 text-center lg:text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight dark:text-slate-50">
          Welcome Back
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Log in to your RacoFlow account.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmit} className="space-y-4">
        <InputGroup
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="name@company.com"
          required
        />

        <div className="space-y-1">
          {/* here code changes */}
          <div className="relative">
            <InputGroup
              label="Password"
              id="password"
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"} // here code changes
              required
            />

            {/* here code changes */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-cyan-500 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <SubmitButton text="Sign In" isLoading={isLoading} />
      </form>

      <SocialSeparator />
      <GoogleButton />
    </div>
  );
}

// Updated SubmitButton with loading state support
function SubmitButton({
  text,
  isLoading,
}: {
  text: string;
  isLoading?: boolean;
}) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileHover={
        !isLoading
          ? {
              scale: 1.01,
              boxShadow: "0 0 15px rgba(34, 211, 238, 0.4)",
            }
          : {}
      }
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      className="group relative w-full bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-[#020617] font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 text-[#020617]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isLoading ? "Authenticating..." : text}
      </span>
    </motion.button>
  );
}
