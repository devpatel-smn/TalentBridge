import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ErrorState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { adminApi } from '@/features/admin/api/admin-api';
import { getApiErrorMessage } from '@/lib/api-client';
import { titleCase } from '@/lib/utils';

interface SystemSetting {
    key: string;
    value: Record<string, unknown>;
    group: string;
    description?: string | null;
    updated_at?: string | null;
}

type SettingDraft = Record<string, Record<string, unknown>>;

function isBooleanSetting(value: Record<string, unknown>): boolean {
    return typeof value.enabled === 'boolean';
}

function isStringSetting(value: Record<string, unknown>): boolean {
    return (
        typeof value.value === 'string' ||
        (Object.keys(value).length === 1 && typeof Object.values(value)[0] === 'string')
    );
}

function getStringValue(value: Record<string, unknown>): string {
    if (typeof value.value === 'string') return value.value;
    const first = Object.values(value)[0];
    return typeof first === 'string' ? first : JSON.stringify(value, null, 2);
}

function getBooleanValue(value: Record<string, unknown>): boolean {
    return Boolean(value.enabled);
}

function buildDraft(settings: SystemSetting[]): SettingDraft {
    return settings.reduce<SettingDraft>((acc, setting) => {
        acc[setting.key] = { ...setting.value };
        return acc;
    }, {});
}

export function AdminSettingsPage() {
    const queryClient = useQueryClient();
    const [draft, setDraft] = useState<SettingDraft>({});

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: adminApi.settings,
    });

    const settings = useMemo(() => (Array.isArray(data) ? (data as SystemSetting[]) : []), [data]);

    useEffect(() => {
        if (settings.length > 0) {
            setDraft(buildDraft(settings));
        }
    }, [settings]);

    const groupedSettings = useMemo(() => {
        return settings.reduce<Record<string, SystemSetting[]>>((groups, setting) => {
            const group = setting.group || 'general';
            if (!groups[group]) groups[group] = [];
            groups[group].push(setting);
            return groups;
        }, {});
    }, [settings]);

    const updateMutation = useMutation({
        mutationFn: (
            payload: Array<{
                key: string;
                value: Record<string, unknown>;
                group: string;
                description?: string;
            }>,
        ) => adminApi.updateSettings(payload as unknown as Record<string, unknown>),
        onSuccess: () => {
            toast.success('Settings saved');
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
        },
        onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to save settings')),
    });

    const updateDraftValue = (key: string, value: Record<string, unknown>) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        const changedSettings = settings
            .filter((setting) => JSON.stringify(draft[setting.key]) !== JSON.stringify(setting.value))
            .map((setting) => ({
                key: setting.key,
                value: draft[setting.key] ?? setting.value,
                group: setting.group,
                description: setting.description ?? undefined,
            }));

        if (!changedSettings.length) return;
        updateMutation.mutate(changedSettings);
    };

    const hasChanges = useMemo(() => {
        return settings.some((setting) => {
            const current = draft[setting.key];
            return JSON.stringify(current) !== JSON.stringify(setting.value);
        });
    }, [settings, draft]);

    if (isLoading) {
        return <LoadingSpinner label="Loading settings..." />;
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load settings"
                description={error instanceof Error ? error.message : 'An unexpected error occurred.'}
                onRetry={() => refetch()}
            />
        );
    }

    if (settings.length === 0) {
        return (
            <div className="space-y-6">
                <PageHeader title="Settings" description="Configure platform-wide system settings." />
                <Card>
                    <CardContent className="py-12 text-center text-sm text-muted-foreground">
                        No system settings have been configured yet.
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                description="Configure platform-wide system settings."
                actions={
                    <Button onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
                        {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                }
            />

            {Object.entries(groupedSettings).map(([group, groupSettings]) => (
                <Card key={group}>
                    <CardHeader>
                        <CardTitle>{titleCase(group)}</CardTitle>
                        <CardDescription>Manage {group} configuration options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {groupSettings.map((setting) => {
                            const value = draft[setting.key] ?? setting.value;

                            return (
                                <div key={setting.key} className="space-y-2 border-b pb-6 last:border-0 last:pb-0">
                                    <div>
                                        <Label className="text-base">{titleCase(setting.key.replace(/_/g, ' '))}</Label>
                                        {setting.description && (
                                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                                        )}
                                    </div>

                                    {isBooleanSetting(value) ? (
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={getBooleanValue(value)}
                                                onCheckedChange={(checked) =>
                                                    updateDraftValue(setting.key, { ...value, enabled: checked })
                                                }
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {getBooleanValue(value) ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </div>
                                    ) : isStringSetting(value) ? (
                                        <Input
                                            value={getStringValue(value)}
                                            onChange={(e) =>
                                                updateDraftValue(setting.key, {
                                                    ...value,
                                                    value: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <Textarea
                                            value={JSON.stringify(value, null, 2)}
                                            onChange={(e) => {
                                                try {
                                                    const parsed = JSON.parse(e.target.value) as Record<string, unknown>;
                                                    updateDraftValue(setting.key, parsed);
                                                } catch {
                                                    // Allow invalid JSON while typing; validation on save could be added
                                                }
                                            }}
                                            rows={4}
                                            className="font-mono text-xs"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
