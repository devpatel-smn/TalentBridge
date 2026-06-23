import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Download,
    FilePen,
    FileText,
    Plus,
    Star,
    Trash2,
    Upload,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState, ErrorState } from '@/components/common/EmptyState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatDate, titleCase } from '@/lib/utils';
import type { Resume } from '@/types/models';

export function ResumePage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [createMode, setCreateMode] = useState<'builder' | 'upload'>('builder');
    const [title, setTitle] = useState('');
    const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: resumes = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'resumes'],
        queryFn: jobSeekerApi.resumes.list,
    });

    const createMutation = useMutation({
        mutationFn: (payload: { title: string; source: string }) => jobSeekerApi.resumes.create(payload),
        onSuccess: (resume) => {
            toast.success('Resume created');
            setCreateOpen(false);
            setTitle('');
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'resumes'] });
            if (resume.source === 'builder') {
                window.location.href = `/job-seeker/resume/${resume.uuid}/builder`;
            }
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to create resume')),
    });

    const deleteMutation = useMutation({
        mutationFn: jobSeekerApi.resumes.delete,
        onSuccess: () => {
            toast.success('Resume deleted');
            setDeleteUuid(null);
            queryClient.invalidateQueries({ queryKey: ['job-seeker', 'resumes'] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to delete resume')),
    });

    const exportMutation = useMutation({
        mutationFn: jobSeekerApi.resumes.export,
        onSuccess: (data) => {
            if (data.url) window.open(data.url, '_blank');
            toast.success('Resume exported');
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to export resume')),
    });

    const openCreate = (mode: 'builder' | 'upload') => {
        setCreateMode(mode);
        setTitle('');
        setCreateOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Resumes"
                description="Create and manage resumes for your job applications."
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => openCreate('upload')}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </Button>
                        <Button onClick={() => openCreate('builder')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Build resume
                        </Button>
                    </div>
                }
            />

            {isLoading ? (
                <LoadingSpinner label="Loading resumes..." />
            ) : isError ? (
                <ErrorState title="Unable to load resumes" onRetry={() => refetch()} />
            ) : resumes.length === 0 ? (
                <EmptyState
                    icon={<FileText className="h-6 w-6 text-muted-foreground" />}
                    title="No resumes yet"
                    description="Create a resume with our builder or upload an existing one to start applying."
                    action={{ label: 'Build resume', onClick: () => openCreate('builder') }}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume: Resume) => (
                        <Card key={resume.uuid} className="transition-all hover:shadow-md">
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold">{resume.title}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Updated {formatDate(resume.updated_at)}
                                        </p>
                                    </div>
                                    {resume.is_primary && (
                                        <Badge variant="default" className="shrink-0">
                                            <Star className="mr-1 h-3 w-3" />
                                            Primary
                                        </Badge>
                                    )}
                                </div>
                                <Badge variant="secondary">{titleCase(resume.source)}</Badge>
                                <div className="flex flex-wrap gap-2">
                                    {resume.source === 'builder' && (
                                        <Button asChild variant="outline" size="sm">
                                            <Link to={`/job-seeker/resume/${resume.uuid}/builder`}>
                                                <FilePen className="mr-1.5 h-3.5 w-3.5" />
                                                Edit
                                            </Link>
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={exportMutation.isPending}
                                        onClick={() => exportMutation.mutate(resume.uuid)}
                                    >
                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                        Export
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => setDeleteUuid(resume.uuid)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {createMode === 'builder' ? 'Create resume with builder' : 'Upload resume'}
                        </DialogTitle>
                        <DialogDescription>
                            {createMode === 'builder'
                                ? 'Start building a professional resume with our section editor.'
                                : 'Create a resume entry for your uploaded document.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="resume-title">Resume title</Label>
                        <Input
                            id="resume-title"
                            placeholder="e.g. Software Engineer Resume"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!title.trim() || createMutation.isPending}
                            onClick={() =>
                                createMutation.mutate({
                                    title: title.trim(),
                                    source: createMode,
                                    ...(createMode === 'builder' ? { template_key: 'modern' } : {}),
                                })
                            }
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={!!deleteUuid}
                onOpenChange={(open) => !open && setDeleteUuid(null)}
                title="Delete resume?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onConfirm={() => deleteUuid && deleteMutation.mutate(deleteUuid)}
            />
        </div>
    );
}
