"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, Play, Download } from 'lucide-react';

export default function JobDetailPage() {
    const { id } = useParams();
    const [job, setJob] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchJob();
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/jobs/${id}`);
            if (res.ok) setJob(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/submissions/job/${id}`);
            if (res.ok) setSubmissions(await res.json());
        } catch (e) { console.error(e); }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setUploading(true);
        const formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append('files', e.target.files[i]);
        }

        try {
            const res = await fetch(`http://localhost:3001/api/submissions/job/${id}`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                fetchSubmissions();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const startGrading = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/submissions/job/${id}/start`, {
                method: 'POST'
            });
            if (res.ok) {
                // alert("Grading started!");
                fetchSubmissions();
                fetchJob();
            } else {
                console.error("Failed to start grading");
                alert("Failed to start grading");
            }
        } catch (e) {
            console.error(e);
            alert("Error starting grading");
        }
    };

    const exportCSV = () => {
        if (submissions.length === 0) return;
        const headers = ['Student Name', 'Filename', 'Status', 'Score', 'Feedback'];
        const rows = submissions.map(sub => [
            sub.student_name,
            sub.original_filename,
            sub.status,
            sub.grade_result?.score || '',
            `"${(sub.grade_result?.feedback || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `grading_results_${job.title}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!job) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading job details...</div>;

    return (
        <div className="container mx-auto p-6 md:p-12 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Created {new Date(job.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/5">{job.strictness}</span>
                        <span className="flex items-center gap-1">Max Points: {job.total_points}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={exportCSV} disabled={submissions.length === 0}>
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <div className="relative">
                        <Input
                            type="file"
                            multiple
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                        <Button variant="outline" className="w-full relative z-0" disabled={uploading}>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload Submissions'}
                        </Button>
                    </div>
                    <Button onClick={startGrading} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-900/20">
                        <Play className="w-4 h-4 mr-2" /> Start Grading
                    </Button>
                </div>
            </div>

            <div className="bg-card border border-white/10 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <h2 className="font-semibold flex items-center gap-2">
                        Submissions
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">{submissions.length}</span>
                    </h2>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                        Supported: PDF, DOCX, TXT, ZIP
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center text-muted-foreground bg-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium mb-1">No submissions yet</p>
                        <p className="text-sm max-w-xs mx-auto">Upload student files individually or drag and drop a ZIP file containing all submissions.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {submissions.map((sub: any) => (
                            <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm md:text-base">{sub.student_name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-xs" title={sub.original_filename}>{sub.original_filename}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sub.status === 'GRADED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        sub.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                        }`}>
                                        {sub.status}
                                    </div>
                                    {sub.grade_result ? (
                                        <div className="font-bold text-lg w-16 text-right">
                                            {sub.grade_result.score} <span className="text-xs text-muted-foreground font-normal">/ {job.total_points}</span>
                                        </div>
                                    ) : (
                                        <div className="w-16 text-right text-xs text-muted-foreground">-</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
