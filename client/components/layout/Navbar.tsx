"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md"
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                    GradeFlow
                </Link>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Jobs
                    </Link>
                    <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                        Get Started
                    </Button>
                </div>
            </div>
        </motion.nav>
    );
}
