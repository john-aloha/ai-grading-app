"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-full bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              onClick={scrollToHowItWorks}
            >
              How It Works
            </Button>
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Grade hundreds of assignments in minutes, not hours. Our AI-powered system ensures consistent, fair, and detailed feedback.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create a Job",
                description: "Set up your grading parameters: assignment instructions, rubric, point values, and strictness level.",
                icon: "📝"
              },
              {
                step: "2",
                title: "Upload Submissions",
                description: "Drag and drop student submissions in bulk. We support PDF, DOCX, and text files.",
                icon: "📤"
              },
              {
                step: "3",
                title: "Get Results",
                description: "Receive detailed grades with personalized feedback and rubric breakdowns for each student.",
                icon: "✨"
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-400">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-600/10 to-indigo-600/10"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-violet-400 mb-2">95%</div>
                <div className="text-muted-foreground">Time Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-violet-400 mb-2">10,000+</div>
                <div className="text-muted-foreground">Papers Graded</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-violet-400 mb-2">4.9/5</div>
                <div className="text-muted-foreground">Teacher Rating</div>
              </div>
            </div>
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/jobs/new">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-500/25 transition-all hover:scale-105">
                Start Grading Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
