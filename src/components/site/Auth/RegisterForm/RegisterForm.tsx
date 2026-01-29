/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

import { InputGroup } from "../InputGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SocialSeparator } from "../SocialSeparator";
import { GoogleButton } from "../GoogleButton";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "solver">("user");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const fname = formData.get("fname");
      const lname = formData.get("lname");
      const email = formData.get("email");
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (!fname || !lname || !email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const result = await signIn("credentials", {
        email: email as string,
        password: password as string,
        name: `${fname} ${lname}`,
        role: selectedRole,
        isRegister: "true",
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);
      if (result?.ok) router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full transition-colors duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-cyan-600 dark:text-cyan-400">
          Create Account
        </h1>
        <p className="text-muted-foreground text-sm">
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

        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div className="relative group">
            <InputGroup
              label="Password"
              id="reg-password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8.5 p-1 rounded-md text-muted-foreground hover:text-cyan-500 hover:bg-muted transition-all"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <InputGroup
              label="Confirm Password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="••••••••"
              type={showConfirmPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8.5 p-1 rounded-md text-muted-foreground hover:text-cyan-500 hover:bg-muted transition-all"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Your Role
          </Label>
          <Select
            value={selectedRole}
            onValueChange={(value: "user" | "solver") => setSelectedRole(value)}
          >
            <SelectTrigger className="  bg-primary-foreground border-input hover:border-cyan-500/50 transition-colors">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className=" text-primary">
              <SelectItem value="user">Standard User</SelectItem>
              <SelectItem value="solver">Problem Solver</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground/70 italic">
            Admin accounts require manual verification.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <p className="text-sm text-destructive font-medium">{error}</p>
          </motion.div>
        )}

        <SubmitButton text="Create Account" isLoading={isLoading} />
      </form>

      <SocialSeparator />
      <GoogleButton />
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
          ? { scale: 1.01, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }
          : {}
      }
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      className="w-full bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-[#020617] font-bold py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading ? (
          <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {isLoading ? "Processing..." : text}
      </span>
    </motion.button>
  );
}
