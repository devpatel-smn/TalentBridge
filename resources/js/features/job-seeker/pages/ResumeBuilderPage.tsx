import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Check,
    Eye,
    EyeOff,
    GripVertical,
    Loader2,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { jobSeekerApi } from '@/features/job-seeker/api/job-seeker-api';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api-client';
import { titleCase } from '@/lib/utils';
import type { ResumeSection } from '@/types/models';

const SECTION_TYPES = ['summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'custom'];

function createSection(type: string, order: number): ResumeSection {
    const defaults: Record<string, Record<string, unknown>> = {
        summary: { text: '' },
        experience: { company: '', title: '', start_date: '', end_date: '', description: '' },
        education: { institution: '', degree: '', field: '', graduation_year: '' },
        skills: { items: '' },
        certifications: { name: '', issuer: '', date: '' },
        projects: { name: '', url: '', description: '' },
        custom: { body: '' },
    };
    return {
        section_type: type,
        title: titleCase(type),
        content: defaults[type] ?? { body: '' },
        sort_order: order,
        is_visible: true,
    };
}

export function ResumeBuilderPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const [sections, setSections] = useState<ResumeSection[]>([]);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const initialLoad = useRef(true);
    const debouncedSections = useDebounce(sections, 800);

    const { data: resume, isLoading, isError, refetch } = useQuery({
        queryKey: ['job-seeker', 'resume', uuid],
        queryFn: () => jobSeekerApi.resumes.get(uuid!),
        enabled: !!uuid,
    });

    useEffect(() => {
        if (resume?.sections) {
            setSections([...resume.sections].sort((a, b) => a.sort_order - b.sort_order));
            initialLoad.current = true;
        }
    }, [resume]);

    const saveMutation = useMutation({
        mutationFn: (payload: ResumeSection[]) => jobSeekerApi.resumes.updateSections(uuid!, payload),
        onMutate: () => setSaveStatus('saving'),
        onSuccess: () => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        },
        onError: (error) => {
            setSaveStatus('error');
            toast.error(getApiErrorMessage(error, 'Failed to save'));
        },
    });

    useEffect(() => {
        if (!uuid || !resume) return;
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }
        saveMutation.mutate(debouncedSections);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSections, uuid]);

    const updateSection = useCallback((index: number, updates: Partial<ResumeSection>) => {
        setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)));
    }, []);

    const updateContent = useCallback((index: number, key: string, value: string) => {
        setSections((prev) =>
            prev.map((s, i) =>
                i === index ? { ...s, content: { ...s.content, [key]: value } } : s,
            ),
        );
    }, []);

    const addSection = (type: string) => {
        setSections((prev) => [...prev, createSection(type, prev.length)]);
    };

    const removeSection = (index: number) => {
        setSections((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, sort_order: i })));
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        setSections((prev) => {
            const next = [...prev];
            const target = direction === 'up' ? index - 1 : index + 1;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next.map((s, i) => ({ ...s, sort_order: i }));
        });
    };

    if (!uuid) return <ErrorState title="Invalid resume" description="No resume ID provided." />;
    if (isLoading) return <LoadingSpinner label="Loading resume builder..." />;
    if (isError || !resume) return <ErrorState title="Unable to load resume" onRetry={() => refetch()} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link to="/job-seeker/resume">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <PageHeader
                    title={resume.title}
                    description="Edit sections below — changes save automatically."
                    actions={
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {saveStatus === 'saving' && (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            )}
                            {saveStatus === 'saved' && (
                                <>
                                    <Check className="h-4 w-4 text-success" />
                                    Saved
                                </>
                            )}
                            {saveStatus === 'error' && (
                                <>
                                    <Save className="h-4 w-4 text-destructive" />
                                    Save failed
                                </>
                            )}
                        </div>
                    }
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <Select onValueChange={addSection}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add section" />
                    </SelectTrigger>
                    <SelectContent>
                        {SECTION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                                {titleCase(type)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => addSection('custom')}>
                    <Plus className="mr-1.5 h-4 w-4" />
                    Custom section
                </Button>
            </div>

            {sections.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <p className="text-muted-foreground">No sections yet. Add a section to get started.</p>
                        <Button className="mt-4" onClick={() => addSection('summary')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add summary
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <Card key={`${section.section_type}-${index}`} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b bg-muted/30 py-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="flex-1 text-base">
                                    <Input
                                        value={section.title ?? titleCase(section.section_type)}
                                        onChange={(e) => updateSection(index, { title: e.target.value })}
                                        className="h-8 border-0 bg-transparent font-semibold shadow-none focus-visible:ring-0"
                                    />
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveSection(index, 'up')}>
                                        ↑
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveSection(index, 'down')}>
                                        ↓
                                    </Button>
                                    <Switch
                                        checked={section.is_visible}
                                        onCheckedChange={(v) => updateSection(index, { is_visible: v })}
                                    />
                                    {section.is_visible ? (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                        onClick={() => removeSection(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4 p-5 md:grid-cols-2">
                                {section.section_type === 'summary' && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Summary</Label>
                                        <Textarea
                                            rows={4}
                                            value={String(section.content.text ?? '')}
                                            onChange={(e) => updateContent(index, 'text', e.target.value)}
                                        />
                                    </div>
                                )}
                                {section.section_type === 'experience' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Job title</Label>
                                            <Input
                                                value={String(section.content.title ?? '')}
                                                onChange={(e) => updateContent(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company</Label>
                                            <Input
                                                value={String(section.content.company ?? '')}
                                                onChange={(e) => updateContent(index, 'company', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Start date</Label>
                                            <Input
                                                value={String(section.content.start_date ?? '')}
                                                onChange={(e) => updateContent(index, 'start_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End date</Label>
                                            <Input
                                                value={String(section.content.end_date ?? '')}
                                                onChange={(e) => updateContent(index, 'end_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                rows={3}
                                                value={String(section.content.description ?? '')}
                                                onChange={(e) => updateContent(index, 'description', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                {section.section_type === 'education' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Institution</Label>
                                            <Input
                                                value={String(section.content.institution ?? '')}
                                                onChange={(e) => updateContent(index, 'institution', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Degree</Label>
                                            <Input
                                                value={String(section.content.degree ?? '')}
                                                onChange={(e) => updateContent(index, 'degree', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Field of study</Label>
                                            <Input
                                                value={String(section.content.field ?? '')}
                                                onChange={(e) => updateContent(index, 'field', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Graduation year</Label>
                                            <Input
                                                value={String(section.content.graduation_year ?? '')}
                                                onChange={(e) => updateContent(index, 'graduation_year', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                                {section.section_type === 'skills' && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Skills (comma-separated)</Label>
                                        <Textarea
                                            rows={2}
                                            value={String(section.content.items ?? '')}
                                            onChange={(e) => updateContent(index, 'items', e.target.value)}
                                        />
                                    </div>
                                )}
                                {!['summary', 'experience', 'education', 'skills'].includes(section.section_type) && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Content</Label>
                                        <Textarea
                                            rows={4}
                                            value={String(section.content.body ?? section.content.description ?? '')}
                                            onChange={(e) => updateContent(index, 'body', e.target.value)}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
