"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        total_points: 100,
        strictness: 'NORMAL',
        assignment_instructions_text: '',
        rubric_text: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to create job');

            const job = await res.json();
            router.push(`/jobs/${job.id}`); // Redirect to upload page (to be built)
        } catch (error) {
            alert('Error creating job');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl p-6 md:p-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Grading Job</h1>
                <p className="text-muted-foreground">Setup the parameters for the AI grader.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Job Title</label>
                    <Input
                        required
                        placeholder="e.g. History Essay #1"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Total Points</label>
                        <Input
                            type="number"
                            required
                            min={1}
                            max={1000}
                            value={formData.total_points}
                            onChange={(e) => setFormData({ ...formData, total_points: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Strictness</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.strictness}
                            onChange={(e) => setFormData({ ...formData, strictness: e.target.value })}
                        >
                            <option value="NORMAL">Normal</option>
                            <option value="STRICT">Strict</option>
                            <option value="LENIENT">Lenient</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Assignment Instructions</label>
                    <Textarea
                        required
                        placeholder="Paste the assignment instructions here..."
                        className="h-32"
                        value={formData.assignment_instructions_text}
                        onChange={(e) => setFormData({ ...formData, assignment_instructions_text: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Rubric (Optional)</label>
                    <Textarea
                        placeholder="Paste your grading rubric here. If left empty, we will generate one based on instructions."
                        className="h-32"
                        value={formData.rubric_text}
                        onChange={(e) => setFormData({ ...formData, rubric_text: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                        {loading ? 'Creating...' : 'Create & Continue'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
