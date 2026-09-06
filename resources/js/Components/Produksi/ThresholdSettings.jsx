import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AdjustmentsHorizontalIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Alert from '@/Components/Alert';
import Table from '@/Components/Table';
import Card from '@/Components/Card';

function ThresholdRow({ setting, canEdit }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal]         = useState(setting.value);
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        const intVal = parseInt(val);
        if (!intVal || intVal < 1) return;
        setLoading(true);
        router.patch(
            route('produksi.threshold.update'),
            { key: setting.key, value: intVal },
            {
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                    setEditing(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setVal(setting.value);
        setEditing(false);
    };

    // Ekstrak nama divisi dari key: "produksi.threshold.cutting" → "Cutting"
    const divisiName = setting.key.split('.').pop();
    const divisiLabel = divisiName.charAt(0).toUpperCase() + divisiName.slice(1);

    const getRiskColor = (days) => {
        if (days <= 2) return 'bg-accent/10 text-accent border-accent/20';
        if (days <= 5) return 'bg-gold/10 text-gold border-gold/20';
        return 'bg-danger/10 text-danger border-danger/20';
    };

    return (
        <Table.Row>
            <Table.Cell>
                <div className="font-medium text-ink">{divisiLabel}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">{setting.description}</div>
            </Table.Cell>
            <Table.Cell className="text-center">
                {editing ? (
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                            className="w-16 text-[13px] border border-line rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-navy text-ink"
                            autoFocus
                            disabled={loading}
                        />
                        <span className="text-[12px] text-ink-soft">hari</span>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="text-accent hover:text-accent/70 disabled:opacity-50"
                            title="Simpan"
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="text-danger hover:text-danger/70 disabled:opacity-50"
                            title="Batal"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[12px] font-semibold ${getRiskColor(setting.value)}`}>
                            {setting.value} hari
                        </span>
                        {canEdit && (
                            <button
                                onClick={() => setEditing(true)}
                                className="text-ink-soft hover:text-navy transition-colors"
                                title="Edit threshold"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </Table.Cell>
            <Table.Cell className="text-center">
                <span className="text-[12px] text-ink-soft">
                    Jika &gt; {setting.value} hari → 🔴 Bottleneck
                </span>
            </Table.Cell>
        </Table.Row>
    );
}

export default function ThresholdSettings({ thresholdConfig, canEdit = false }) {
    if (!thresholdConfig?.length) return null;

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-navy" />
                <h3 className="text-[16px] font-oswald font-bold text-ink">
                    Pengaturan Threshold Bottleneck
                </h3>
                {!canEdit && (
                    <span className="text-[11px] text-ink-soft ml-2">(Hanya Admin/Owner yang dapat mengubah)</span>
                )}
            </div>

            {canEdit && (
                <div className="mb-4">
                    <Alert type="info" title="Info Edit Threshold" description="Klik ikon pensil untuk mengubah threshold. Perubahan langsung berlaku dan mempengaruhi deteksi bottleneck di seluruh sistem. Tekan Enter untuk menyimpan." />
                </div>
            )}

            <Card className="!p-0 overflow-hidden">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Divisi</Table.HeadCell>
                        <Table.HeadCell className="text-center">Threshold Saat Ini</Table.HeadCell>
                        <Table.HeadCell className="text-center">Kondisi Bottleneck</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {thresholdConfig.map((setting) => (
                            <ThresholdRow
                                key={setting.key}
                                setting={setting}
                                canEdit={canEdit}
                            />
                        ))}
                    </Table.Body>
                </Table>
            </Card>
        </div>
    );
}
