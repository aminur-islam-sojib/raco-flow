/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText,
  Tag,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useProjects } from "@/Hooks/useProjects";

const projectSchema = z.object({
  title: z.string().min(5, "Title too short").max(100),
  description: z.string().min(20, "Please provide more detail"),
  budget: z.coerce.number().min(0, "Budget cannot be negative"),
  deadline: z.string().min(1, "Deadline is required"),
  category: z.string().min(1, "Select a category"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const STEPS = ["Core Details", "Budget & Timeline", "Final Review"];

export default function CreateProjectPage() {
  const router = useRouter();
  const { createProject, loading: apiLoading } = useProjects();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema) as unknown as Resolver<
      ProjectFormValues,
      any
    >,
    defaultValues: {
      title: "",
      description: "",
      budget: 0,
      deadline: "",
      category: "",
    },
    mode: "onChange",
  });

  const { watch, trigger, handleSubmit } = form;
  const formData = watch();

  const nextStep = async () => {
    const fields =
      currentStep === 0
        ? ["title", "description", "category"]
        : ["budget", "deadline"];

    const isValid = await trigger(fields as any);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setErrorMessage(null);
    const result = await createProject(data);

    if (result.success) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#ffffff", "#3b82f6"],
      });
      setIsSuccess(true);
      setTimeout(() => router.push("/marketplace"), 2500);
    } else {
      setErrorMessage(result.error || "Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Stepped Form */}
        <div className="lg:col-span-7">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Launch Project
            </h1>
            <div className="flex items-center gap-4 mt-6">
              {STEPS.map((step, idx) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                      idx <= currentStep
                        ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        : "border-slate-700 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-xs uppercase tracking-widest hidden md:block ${idx <= currentStep ? "text-slate-200" : "text-slate-500"}`}
                  >
                    {step}
                  </span>
                  {idx < 2 && <div className="w-8 h-px bg-slate-800" />}
                </div>
              ))}
            </div>
          </header>

          <Card className="relative p-8 bg-slate-900/40 backdrop-blur-3xl border-slate-800 overflow-hidden group">
            <div className="absolute inset-0 p-px -z-10 rounded-2xl bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-500/40 transition-all duration-500" />

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit as any)}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Project Title
                        </label>
                        <Input
                          {...form.register("title")}
                          placeholder="e.g. Next-Gen Neural Interface"
                          className="bg-slate-950/50 border-slate-800 focus:border-cyan-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Category
                        </label>
                        <Select
                          onValueChange={(v) => {
                            form.setValue("category", v);
                            form.trigger("category");
                          }}
                        >
                          <SelectTrigger className="bg-slate-950/50 border-slate-800">
                            <SelectValue placeholder="Select Sector" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                            <SelectItem value="Development">
                              Development
                            </SelectItem>
                            <SelectItem value="AI/ML">
                              AI / Machine Learning
                            </SelectItem>
                            <SelectItem value="Design">
                              Visual Design
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Description
                        </label>
                        <Textarea
                          {...form.register("description")}
                          rows={5}
                          placeholder="Describe the mission scope..."
                          className="bg-slate-950/50 border-slate-800 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Budget (USD)
                        </label>
                        <div className="relative border-slate-800">
                          <DollarSign className="absolute left-3 top-3 w-4 h-4 text-cyan-500" />
                          <Input
                            {...form.register("budget")}
                            type="number"
                            className="pl-10 bg-slate-950/50 border-slate-800 focus:border-cyan-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">
                          Target Deadline
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-4 h-4 text-cyan-500" />
                          <Input
                            {...form.register("deadline")}
                            type="date"
                            className="pl-10 bg-slate-950/50 border-slate-800 focus:border-cyan-500 text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-cyan-400 mb-2">
                        <Rocket className="w-5 h-5" />
                        <h3 className="text-lg font-semibold uppercase tracking-tight">
                          Transmission Review
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReviewItem
                          icon={<FileText className="w-4 h-4" />}
                          label="Title"
                          value={formData.title}
                        />
                        <ReviewItem
                          icon={<Tag className="w-4 h-4" />}
                          label="Category"
                          value={formData.category}
                        />
                        <ReviewItem
                          icon={<DollarSign className="w-4 h-4" />}
                          label="Budget"
                          value={`$${formData.budget}`}
                        />
                        <ReviewItem
                          icon={<Clock className="w-4 h-4" />}
                          label="Deadline"
                          value={formData.deadline}
                        />
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">
                          Scope Description
                        </label>
                        <p className="text-sm text-slate-300 leading-relaxed max-h-32 overflow-y-auto pr-2">
                          {formData.description}
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 italic text-center">
                        Please verify all parameters before initiating the
                        global broadcast.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-6 border-t border-slate-800/50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={currentStep === 0}
                  className="text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-8"
                  >
                    Review Details <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    disabled={apiLoading}
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-12 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    {apiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Broadcast Project"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Live Preview (Persistent for UX continuity) */}
        <aside className="lg:col-span-5 sticky top-12 h-fit">
          <div className="text-xs font-mono text-cyan-500/50 uppercase tracking-[0.2em] mb-4">
            Marketplace Live Preview
          </div>
          <motion.div
            layout
            className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 shadow-2xl backdrop-blur-sm"
          >
            {/* Same preview logic as before */}
            <div className="flex justify-between items-start mb-6">
              <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 uppercase font-bold tracking-widest">
                {formData.category || "Category"}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  ${formData.budget || "0"}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ESTIMATED BUDGET
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 line-clamp-2">
              {formData.title || "Project Alpha Title"}
            </h2>
            <p className="text-slate-400 text-sm mb-8 line-clamp-4 leading-relaxed italic">
              {formData.description ||
                "The mission description will manifest here..."}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-tighter">
                  Deadline
                </div>
                <div className="text-sm font-mono text-slate-200">
                  {formData.deadline || "TBD"}
                </div>
              </div>
              <div className="text-sm font-mono text-emerald-400 flex items-center gap-1 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                Pre-Flight
              </div>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-cyan-500/30 p-10 rounded-3xl max-w-md text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-2">Success</h2>
              <p className="text-slate-400 mb-8">
                Your project is now live on the RacoFlow stream.
              </p>
              <Button
                onClick={() => router.push("/marketplace")}
                className="w-full bg-cyan-600 hover:bg-cyan-500"
              >
                Go to Marketplace
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Component for the Final Review Step
function ReviewItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
      <div className="text-cyan-500 mt-1">{icon}</div>
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-500">
          {label}
        </div>
        <div className="text-sm font-medium text-slate-200 truncate max-w-[150px]">
          {value || "Not Set"}
        </div>
      </div>
    </div>
  );
}
