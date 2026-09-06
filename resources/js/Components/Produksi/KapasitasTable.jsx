import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
            <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">
                    {(value ?? 0).toLocaleString('id-ID')} pcs
                </span>
                <button
                    onClick={() => setEditing(true)}
                    className="text-gray-400 hover:text-brand-600 transition-colors"
                    title="Edit target"
                >
                    <PencilIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <input
                type="number"
                min="0"
                max="99999"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                className="w-24 text-sm border border-brand-300 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
                autoFocus
            />
            <button onClick={handleSave} className="text-green-600 hover:text-green-700" title="Simpan">
                <CheckIcon className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-600" title="Batal">
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
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-brand-700">{totalOrderAktif}</div>
                    <div className="text-xs text-brand-500 mt-0.5">Total Order Aktif Produksi</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-700">{totalPcs.toLocaleString('id-ID')}</div>
                    <div className="text-xs text-blue-500 mt-0.5">Total Pcs Sedang Dikerjakan</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">{totalTarget.toLocaleString('id-ID')}</div>
                    <div className="text-xs text-green-500 mt-0.5">Total Kapasitas Target/Hari</div>
                </div>
            </div>

            {/* Tabel kapasitas */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Divisi</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Aktif</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Pcs</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Harian</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Bottleneck</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {divisis.map((divisi) => {
                            const stat     = statsPerDivisi?.[divisi] ?? {};
                            const hasRisk  = (stat.bottleneck_count ?? 0) > 0 || (stat.overdue_count ?? 0) > 0;
                            const isNormal = !hasRisk && (stat.order_count ?? 0) > 0;

                            return (
                                <tr key={divisi} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {DIVISI_LABELS[divisi]}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                                            {stat.order_count ?? 0}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {(stat.total_pcs ?? 0).toLocaleString('id-ID')} pcs
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center">
                                            <InlineEdit
                                                value={stat.target_pcs}
                                                divisi={divisi}
                                                onSave={handleSaveTarget}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {(stat.bottleneck_count ?? 0) > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                                                ⚠️ {stat.bottleneck_count}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {stat.order_count === 0 ? (
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">Kosong</span>
                                        ) : hasRisk ? (
                                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Berisiko</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Normal</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                * Klik ikon pensil untuk mengubah target harian per divisi. Target tersimpan per hari.
            </p>
        </div>
    );
}
