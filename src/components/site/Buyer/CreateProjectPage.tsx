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
  Calendar as CalendarIconDate,
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Info } from "lucide-react";
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

    console.log("Attempting to validate fields:", fields);
    console.log("Current form values:", formData);

    const isValid = await trigger(fields as any);

    console.log("Validation result:", isValid);
    console.log("Form errors:", form.formState.errors);

    if (isValid) {
      console.log("Moving to next step");
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Validation failed, staying on current step");
    }
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
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Side: Stepped Form */}
        <div className="lg:col-span-7">
          <header className="mb-8">
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
            <div className="absolute inset-0 p-px -z-10 rounded-2xl bg-linear-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-500/40 transition-all duration-500" />

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
                    <div className="space-y-8">
                      {/* Project Title - Modern Glow Input */}
                      <div className="space-y-2 group">
                        <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                          Project Title
                        </label>
                        <div className="relative">
                          <Input
                            {...form.register("title")}
                            placeholder="e.g. Next-Gen Neural Interface"
                            className="h-12 bg-slate-950/40 border-slate-800/60 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 placeholder:text-slate-600 transition-all duration-300 rounded-xl"
                          />
                        </div>
                        {form.formState.errors.title && (
                          <p className="text-xs text-red-400 mt-1">
                            {form.formState.errors.title.message}
                          </p>
                        )}
                      </div>

                      {/* Category - Modern Select */}
                      <div className="space-y-2 group">
                        <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                          Category / Sector
                        </label>
                        <Select
                          onValueChange={(v) => {
                            form.setValue("category", v);
                            form.trigger("category");
                          }}
                        >
                          <SelectTrigger className="h-12 bg-slate-950/40 border-slate-800/60 focus:ring-4 focus:ring-cyan-500/10 hover:bg-slate-900/60 transition-all rounded-xl border-dashed">
                            <SelectValue placeholder="Identify Transmission Sector" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-950 border-slate-800 backdrop-blur-xl">
                            <SelectItem
                              value="Development"
                              className="focus:bg-cyan-500/10 focus:text-cyan-400 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                Full-Stack Development
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="AI/ML"
                              className="focus:bg-cyan-500/10 focus:text-cyan-400 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                AI / Machine Learning
                              </div>
                            </SelectItem>
                            <SelectItem
                              value="Design"
                              className="focus:bg-cyan-500/10 focus:text-cyan-400 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                Visual Design
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.category && (
                          <p className="text-xs text-red-400 mt-1">
                            {form.formState.errors.category.message}
                          </p>
                        )}
                      </div>

                      {/* Description - Modern Glass Textarea */}
                      <div className="space-y-2 group">
                        <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                          Mission Description
                        </label>
                        <div className="relative rounded-xl overflow-hidden bg-slate-950/40 border border-slate-800/60 group-focus-within:border-cyan-500/50 transition-all duration-300">
                          <Textarea
                            {...form.register("description")}
                            rows={6}
                            placeholder="Describe the mission scope, technical requirements, and objectives..."
                            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none placeholder:text-slate-600 leading-relaxed p-4"
                          />
                          {/* Decorative Corner Accent */}
                          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-500/20 group-focus-within:border-cyan-500/60 transition-colors" />

                          {/* Word counter placeholder (Optional UI addition) */}
                          <div className="absolute bottom-2 right-4 text-[10px] font-mono text-slate-600 uppercase">
                            Standard Stream
                          </div>
                        </div>
                        {form.formState.errors.description && (
                          <p className="text-xs text-red-400 mt-1">
                            {form.formState.errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {/* Budget Allocation - Precision Input */}
                      <div className="space-y-3 group">
                        <div className="flex justify-between items-center">
                          <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                            Budget Allocation
                          </label>
                          <span className="text-[10px] font-mono text-cyan-500/50 uppercase">
                            Currency: USD
                          </span>
                        </div>

                        <div className="relative flex items-center">
                          {/* Icon with subtle pulse on container focus */}
                          <div className="absolute left-4 z-10 p-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 group-focus-within:animate-pulse">
                            <DollarSign className="w-4 h-4 text-cyan-500" />
                          </div>

                          <Input
                            {...form.register("budget")}
                            type="number"
                            placeholder="0.00"
                            className="h-14 pl-14 bg-slate-950/40 border-slate-800/60 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all rounded-2xl font-mono text-lg text-cyan-50"
                          />

                          {/* Visual background indicator for depth */}
                          <div className="absolute right-4 pointer-events-none text-slate-700 font-bold group-focus-within:text-cyan-900/30 transition-colors">
                            CREDITS
                          </div>
                        </div>
                      </div>

                      {/* Target Deadline - Futuristic Date Picker Wrapper */}
                      <div className="space-y-3 group">
                        <label className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                          Target Deadline
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-14 justify-start text-left font-normal transition-all rounded-2xl bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/60 hover:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10",
                                !formData.deadline && "text-slate-500",
                              )}
                            >
                              <div className="absolute left-4 z-10 text-cyan-500/60 group-focus-within:text-cyan-400">
                                <CalendarIcon className="w-5 h-5" />
                              </div>

                              <span className="pl-10 text-slate-200">
                                {formData.deadline ? (
                                  format(new Date(formData.deadline), "PPP")
                                ) : (
                                  <span>Pick a temporal node</span>
                                )}
                              </span>

                              {/* Decorative Badge */}
                              <div className="ml-auto px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-500 uppercase">
                                Open Chronos
                              </div>
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent
                            className="w-auto p-0 bg-slate-950 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                formData.deadline
                                  ? new Date(formData.deadline)
                                  : undefined
                              }
                              onSelect={(date) => {
                                // Setting the date as a string for your Zod schema
                                form.setValue(
                                  "deadline",
                                  date ? date.toISOString() : "",
                                );
                                form.trigger("deadline");
                              }}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
                              classNames={{
                                day_selected:
                                  "bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:text-slate-900 focus:bg-cyan-500 focus:text-slate-950 rounded-md",
                                day_today: "bg-slate-800 text-cyan-400",
                                head_cell:
                                  "text-slate-500 font-bold uppercase text-[10px] tracking-tighter",
                                day: "text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-md transition-all",
                                nav_button:
                                  "border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-cyan-400",
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        {/* System Intelligence Helper */}
                        <div className="flex items-center gap-2 px-1">
                          <Info className="w-3 h-3 text-cyan-500/50" />
                          <p className="text-[10px] text-slate-600 italic">
                            Broadcast parameters will lock 24h prior to the
                            selected node.
                          </p>
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
                          value={
                            formData.deadline
                              ? format(new Date(formData.deadline), "PPP")
                              : "Not Set"
                          }
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
                    {currentStep === 0 ? "Continue" : "Review Details"}{" "}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    disabled={apiLoading}
                    type="submit"
                    className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-12 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]"
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
            className="rounded-2xl border border-white/5 bg-linear-to-b from-white/5 to-transparent p-6 shadow-2xl backdrop-blur-sm"
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
                  {formData.deadline
                    ? format(new Date(formData.deadline), "PPP")
                    : "TBD"}
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
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
      <div className="text-cyan-500 mt-1">{icon}</div>
      <div>
        <div className="text-[10px] uppercase font-bold text-slate-500">
          {label}
        </div>
        <div className="text-sm font-medium text-slate-200 truncate max-w-37.5">
          {value || "Not Set"}
        </div>
      </div>
    </div>
  );
}
