import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { AdjustmentsHorizontalIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

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
        if (days <= 2) return 'text-green-600 bg-green-50 border-green-200';
        if (days <= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{divisiLabel}</div>
                <div className="text-xs text-gray-500 mt-0.5">{setting.description}</div>
            </td>
            <td className="px-4 py-3 text-center">
                {editing ? (
                    <div className="flex items-center justify-center gap-1">
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                            className="w-20 text-sm border border-brand-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-brand-500"
                            autoFocus
                            disabled={loading}
                        />
                        <span className="text-xs text-gray-500">hari</span>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="Simpan"
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="text-red-500 hover:text-red-600 disabled:opacity-50"
                            title="Batal"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold ${getRiskColor(setting.value)}`}>
                            {setting.value} hari
                        </span>
                        {canEdit && (
                            <button
                                onClick={() => setEditing(true)}
                                className="text-gray-400 hover:text-brand-600 transition-colors"
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
            </td>
            <td className="px-4 py-3 text-center">
                <span className="text-xs text-gray-500">
                    Jika &gt; {setting.value} hari → 🔴 Bottleneck
                </span>
            </td>
        </tr>
    );
}

export default function ThresholdSettings({ thresholdConfig, canEdit = false }) {
    if (!thresholdConfig?.length) return null;

    return (
        <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-brand-600" />
                <h3 className="text-sm font-semibold text-gray-800">
                    Pengaturan Threshold Bottleneck
                </h3>
                {!canEdit && (
                    <span className="text-xs text-gray-400">(Hanya Admin/Owner yang dapat mengubah)</span>
                )}
            </div>

            {canEdit && (
                <div className="flex items-start gap-2 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <InformationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <p>
                        Klik ikon pensil untuk mengubah threshold. Perubahan langsung berlaku dan
                        mempengaruhi deteksi bottleneck di seluruh sistem. Tekan <kbd className="px-1 py-0.5 bg-white border border-blue-300 rounded text-xs font-mono">Enter</kbd> untuk menyimpan.
                    </p>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Divisi</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Threshold Saat Ini</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Kondisi Bottleneck</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {thresholdConfig.map((setting) => (
                            <ThresholdRow
                                key={setting.key}
                                setting={setting}
                                canEdit={canEdit}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
