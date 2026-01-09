"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl space-y-8"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium"
          >
            🚀 Now powered by GPT-5.2
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Stop Grading. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
              Start Teaching.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload student submissions, attach your rubric, and get detailed, fair, and consistent grades in seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-500/25 transition-all hover:scale-105">
              Start Grading Board
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            How It Works
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
