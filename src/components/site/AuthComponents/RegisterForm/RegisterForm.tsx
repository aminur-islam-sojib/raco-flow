"use client";

// here code changes
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { InputGroup } from "../InputGroup";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { SocialSeparator } from "../SocialSeparator";
import { GoogleButton } from "../GoogleButton";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  // here code changes
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    console.log("Logging in with:", data);

    // Simulate API delay
    setTimeout(() => setIsLoading(false), 2000);
  }
  return (
    <div>
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight dark:text-slate-50">
          Create Account
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Join the next generation of workflow management.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="First Name"
            id="fname"
            name="fname"
            placeholder="John"
          />
          <InputGroup
            label="Last Name"
            id="lname"
            name="lname"
            placeholder="Doe"
          />
        </div>

        <InputGroup
          label="Email"
          id="reg-email"
          name="email"
          type="email"
          placeholder="name@company.com"
        />

        {/* PASSWORDS */}
        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div className="relative">
            <InputGroup
              label="Password"
              id="reg-password"
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />

            {/* here code changes */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-8 z-20 text-slate-500 hover:text-cyan-500 transition"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <InputGroup
              label="Confirm Password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
            />

            {/* here code changes */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-8 z-20 text-slate-500 hover:text-cyan-500 transition"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* ROLE */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Role
          </Label>
          <Select>
            <SelectTrigger className="bg-transparent border-slate-300 dark:border-slate-700">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solver">Problem Solver</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SubmitButton text="Create Account" isLoading={isLoading} />
        <SocialSeparator />
        <GoogleButton />
      </form>
    </div>
  );
}

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
