import Link from 'next/link';
import { Button } from "@/components/ui/button";

async function getJobs() {
    try {
        const res = await fetch('http://localhost:3001/api/jobs', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function DashboardPage() {
    const jobs = await getJobs();

    return (
        <div className="container mx-auto p-6 md:p-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    My Grading Jobs
                </h1>
                <Link href="/jobs/new">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/20">
                        + New Job
                    </Button>
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="p-16 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-white/5 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-xl font-medium text-foreground mb-2">No jobs created yet</p>
                    <p className="text-sm text-muted-foreground mb-8 max-w-xs">Start by creating a new grading job to process your student submissions.</p>
                    <Link href="/jobs/new">
                        <Button variant="secondary" className="px-8">Create Job</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job: any) => (
                        <Link key={job.id} href={`/jobs/${job.id}`}>
                            <div className="group p-6 border border-white/10 rounded-xl bg-card/50 backdrop-blur-sm hover:bg-white/5 hover:border-violet-500/50 transition-all cursor-pointer shadow-sm hover:shadow-violet-900/10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${job.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            job.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                        }`}>
                                        {job.status}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{new Date(job.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                <div className="text-sm text-muted-foreground">
                                    {job._count?.submissions || 0} submissions
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
