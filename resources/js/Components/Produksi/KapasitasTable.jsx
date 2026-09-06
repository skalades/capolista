import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Table from '@/Components/Table';
import Badge from '@/Components/Badge';
import Card from '@/Components/Card';

const DIVISI_LABELS = {
    cutting:    'Cutting',
    jahit:      'Jahit',
    printing:   'Printing',
    pemasangan: 'Pemasangan',
};

function InlineEdit({ value, onSave, divisi }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal]         = useState(value ?? 0);

    const handleSave = () => {
        onSave(divisi, parseInt(val) || 0);
        setEditing(false);
    };

    const handleCancel = () => {
        setVal(value ?? 0);
        setEditing(false);
    };

    if (!editing) {
        return (
            <div className="flex items-center justify-center gap-2">
                <span className="font-semibold text-ink">
                    {(value ?? 0).toLocaleString('id-ID')} pcs
                </span>
                <button
                    onClick={() => setEditing(true)}
                    className="text-ink-soft hover:text-navy transition-colors"
                    title="Edit target"
                >
                    <PencilIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-1">
            <input
                type="number"
                min="0"
                max="99999"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                className="w-24 text-[13px] border border-line rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-navy text-ink"
                autoFocus
            />
            <button onClick={handleSave} className="text-accent hover:text-accent/70" title="Simpan">
                <CheckIcon className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="text-danger hover:text-danger/70" title="Batal">
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function KapasitasTable({ statsPerDivisi }) {
    const divisis = ['cutting', 'jahit', 'printing', 'pemasangan'];

    const handleSaveTarget = (divisi, targetPcs) => {
        router.patch(route('produksi.target.update'), {
            divisi,
            periode: 'daily',
            target_pcs: targetPcs,
        }, {
            preserveScroll: true,
        });
    };

    const totalOrderAktif = divisis.reduce((sum, d) => sum + (statsPerDivisi?.[d]?.order_count ?? 0), 0);
    const totalPcs        = divisis.reduce((sum, d) => sum + (statsPerDivisi?.[d]?.total_pcs ?? 0), 0);
    const totalTarget     = divisis.reduce((sum, d) => sum + (statsPerDivisi?.[d]?.target_pcs ?? 0), 0);

    return (
        <div>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-panel border border-line rounded-xl p-4 text-center shadow-sm">
                    <div className="text-[28px] font-oswald font-bold text-ink">{totalOrderAktif}</div>
                    <div className="text-[12px] font-medium text-ink-soft uppercase tracking-wider mt-1">Total Order Aktif Produksi</div>
                </div>
                <div className="bg-panel border border-line rounded-xl p-4 text-center shadow-sm">
                    <div className="text-[28px] font-oswald font-bold text-navy">{totalPcs.toLocaleString('id-ID')}</div>
                    <div className="text-[12px] font-medium text-ink-soft uppercase tracking-wider mt-1">Total Pcs Sedang Dikerjakan</div>
                </div>
                <div className="bg-panel border border-line rounded-xl p-4 text-center shadow-sm">
                    <div className="text-[28px] font-oswald font-bold text-accent">{totalTarget.toLocaleString('id-ID')}</div>
                    <div className="text-[12px] font-medium text-ink-soft uppercase tracking-wider mt-1">Total Kapasitas Target/Hari</div>
                </div>
            </div>

            {/* Tabel kapasitas */}
            <Card className="!p-0 overflow-hidden">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Divisi</Table.HeadCell>
                        <Table.HeadCell className="text-center">Order Aktif</Table.HeadCell>
                        <Table.HeadCell className="text-center">Total Pcs</Table.HeadCell>
                        <Table.HeadCell className="text-center">Target Harian</Table.HeadCell>
                        <Table.HeadCell className="text-center">Bottleneck</Table.HeadCell>
                        <Table.HeadCell className="text-center">Status</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {divisis.map((divisi) => {
                            const stat     = statsPerDivisi?.[divisi] ?? {};
                            const hasRisk  = (stat.bottleneck_count ?? 0) > 0 || (stat.overdue_count ?? 0) > 0;
                            const isNormal = !hasRisk && (stat.order_count ?? 0) > 0;

                            return (
                                <Table.Row key={divisi}>
                                    <Table.Cell className="font-medium text-ink">
                                        {DIVISI_LABELS[divisi]}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-line/30 text-ink font-semibold text-sm">
                                            {stat.order_count ?? 0}
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell className="text-center text-ink">
                                        {(stat.total_pcs ?? 0).toLocaleString('id-ID')} pcs
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        <InlineEdit
                                            value={stat.target_pcs}
                                            divisi={divisi}
                                            onSave={handleSaveTarget}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        {(stat.bottleneck_count ?? 0) > 0 ? (
                                            <Badge status="danger">
                                                ⚠️ {stat.bottleneck_count}
                                            </Badge>
                                        ) : (
                                            <span className="text-ink-soft text-xs">—</span>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        {stat.order_count === 0 ? (
                                            <Badge status="neutral">Kosong</Badge>
                                        ) : hasRisk ? (
                                            <Badge status="danger">Berisiko</Badge>
                                        ) : (
                                            <Badge status="accent">Normal</Badge>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </Table>
            </Card>

            <p className="text-[11px] text-ink-soft mt-3">
                * Klik ikon pensil untuk mengubah target harian per divisi. Target tersimpan per hari.
            </p>
        </div>
    );
}
