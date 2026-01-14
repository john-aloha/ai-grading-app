"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Clock, Play, Download, Eye, ClipboardList, X, Pencil, Check, Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface PreviewData {
    id: string;
    student_name: string;
    original_filename: string;
    extracted_text: string;
    grade_result?: {
        score: number;
        feedback: string;
        rubric_breakdown: string;
    };
}

export default function JobDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [previewModal, setPreviewModal] = useState<PreviewData | null>(null);
    const [rubricModal, setRubricModal] = useState<any>(null);
    const [editingName, setEditingName] = useState<string | null>(null);
    const [editNameValue, setEditNameValue] = useState('');
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchJob();
        fetchSubmissions();
        const interval = setInterval(fetchSubmissions, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await fetch(`${API_URL}/api/jobs/${id}`);
            if (res.ok) setJob(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await fetch(`${API_URL}/api/submissions/job/${id}`);
            if (res.ok) setSubmissions(await res.json());
        } catch (e) { console.error(e); }
    };

    const uploadFiles = async (files: FileList | File[]) => {
        setUploading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const res = await fetch(`${API_URL}/api/submissions/job/${id}`, {
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        await uploadFiles(e.target.files);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            await uploadFiles(files);
        }
    }, [id]);

    const startGrading = async () => {
        try {
            const res = await fetch(`${API_URL}/api/submissions/job/${id}/start`, {
                method: 'POST'
            });
            if (res.ok) {
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

    const deleteJob = async () => {
        try {
            const res = await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert('Failed to delete job');
            }
        } catch (e) {
            console.error(e);
            alert('Error deleting job');
        }
    };

    const openPreview = async (submissionId: string) => {
        setLoadingPreview(true);
        try {
            const res = await fetch(`${API_URL}/api/submissions/${submissionId}/preview`);
            if (res.ok) {
                const data = await res.json();
                setPreviewModal(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPreview(false);
        }
    };

    const openRubric = (submission: any) => {
        if (submission.grade_result) {
            setRubricModal(submission);
        }
    };

    const startEditName = (submission: any) => {
        setEditingName(submission.id);
        setEditNameValue(submission.student_name);
    };

    const saveEditName = async (submissionId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/submissions/${submissionId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_name: editNameValue })
            });
            if (res.ok) {
                fetchSubmissions();
                setEditingName(null);
            }
        } catch (e) {
            console.error(e);
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
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Created {new Date(job.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/5">{job.strictness}</span>
                        {job.grade_level && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300">
                                Grade {job.grade_level === 'pre-k' ? 'Pre-K' : job.grade_level === 'k' ? 'K' : job.grade_level}
                            </span>
                        )}
                        <span className="flex items-center gap-1">Max Points: {job.total_points}</span>
                    </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <Button variant="outline" onClick={exportCSV} disabled={submissions.length === 0}>
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="text-red-400 hover:text-red-300 hover:border-red-500/50">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    <Button onClick={startGrading} className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-900/20">
                        <Play className="w-4 h-4 mr-2" /> Start Grading
                    </Button>
                </div>
            </div>

            <div
                className={`bg-card border rounded-xl overflow-hidden shadow-sm transition-all ${isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-white/10'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <h2 className="font-semibold flex items-center gap-2">
                        Submissions
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">{submissions.length}</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground hidden sm:block">
                            Supported: PDF, DOCX, TXT, ZIP
                        </div>
                        <div className="relative">
                            <Input
                                type="file"
                                multiple
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                            <Button variant="outline" size="sm" className="relative z-0" disabled={uploading}>
                                <Upload className="w-4 h-4 mr-2" />
                                {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <div className={`p-16 flex flex-col items-center justify-center text-center text-muted-foreground transition-colors ${isDragging ? 'bg-violet-500/10' : 'bg-white/5'}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-violet-500/20' : 'bg-white/5'}`}>
                            <Upload className={`w-8 h-8 ${isDragging ? 'text-violet-400' : 'opacity-50'}`} />
                        </div>
                        <p className="font-medium mb-1">{isDragging ? 'Drop files here!' : 'No submissions yet'}</p>
                        <p className="text-sm max-w-xs mx-auto">
                            {isDragging ? 'Release to upload your files' : 'Drag and drop files here, or click Upload to select files'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {isDragging && (
                            <div className="p-8 text-center bg-violet-500/10 border-b border-violet-500/20">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-violet-400" />
                                <p className="text-violet-300 font-medium">Drop files to add more submissions</p>
                            </div>
                        )}
                        {submissions.map((sub: any) => (
                            <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        {editingName === sub.id ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={editNameValue}
                                                    onChange={(e) => setEditNameValue(e.target.value)}
                                                    className="h-8 w-48"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && saveEditName(sub.id)}
                                                />
                                                <button onClick={() => saveEditName(sub.id)} className="text-green-400 hover:text-green-300">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setEditingName(null)} className="text-red-400 hover:text-red-300">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-sm md:text-base">{sub.student_name}</div>
                                                <button onClick={() => startEditName(sub)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px] md:max-w-xs" title={sub.original_filename}>{sub.original_filename}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => openPreview(sub.id)}
                                        className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                        title="Preview submission"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {sub.grade_result && (
                                        <button
                                            onClick={() => openRubric(sub)}
                                            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                            title="View rubric breakdown"
                                        >
                                            <ClipboardList className="w-4 h-4" />
                                        </button>
                                    )}
                                    <div className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sub.status === 'GRADED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                        sub.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            sub.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
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

            {/* Preview Modal */}
            {previewModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewModal(null)}>
                    <div className="bg-card border border-white/10 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="font-semibold">{previewModal.student_name}</h3>
                                <p className="text-xs text-muted-foreground">{previewModal.original_filename}</p>
                            </div>
                            <button onClick={() => setPreviewModal(null)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Submission Content</h4>
                            <div className="bg-white/5 rounded-lg p-4 whitespace-pre-wrap text-sm font-mono">
                                {previewModal.extracted_text}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rubric Modal */}
            {rubricModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setRubricModal(null)}>
                    <div className="bg-card border border-white/10 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="font-semibold">Grade Results - {rubricModal.student_name}</h3>
                                <p className="text-xs text-muted-foreground">Score: {rubricModal.grade_result.score} / {job.total_points}</p>
                            </div>
                            <button onClick={() => setRubricModal(null)} className="p-2 hover:bg-white/10 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                            <div>
                                <h4 className="text-sm font-medium mb-2 text-violet-400">Feedback</h4>
                                <div className="bg-white/5 rounded-lg p-4 text-sm whitespace-pre-wrap">
                                    {rubricModal.grade_result.feedback}
                                </div>
                            </div>
                            {rubricModal.grade_result.rubric_breakdown && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2 text-violet-400">Rubric Breakdown</h4>
                                    <div className="bg-white/5 rounded-lg p-4 text-sm whitespace-pre-wrap">
                                        {rubricModal.grade_result.rubric_breakdown}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-card border border-white/10 rounded-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-semibold mb-2">Delete Job?</h3>
                        <p className="text-muted-foreground mb-6">
                            This will permanently delete "{job.title}" and all {submissions.length} submission(s). This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button onClick={deleteJob} className="bg-red-600 hover:bg-red-700 text-white">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete Job
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay */}
            {loadingPreview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                </div>
            )}
        </div>
    );
}
