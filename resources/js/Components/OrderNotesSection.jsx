import React from 'react';
import { 
    ChatBubbleBottomCenterTextIcon, 
    PaintBrushIcon, 
    WrenchScrewdriverIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function OrderNotesSection({ 
    order, 
    title = "Catatan Order & Instruksi Divisi",
    className = "",
    showEmpty = true 
}) {
    if (!order) return null;

    const hasCatatanOrder = Boolean(order.catatan && order.catatan.trim());
    const hasCatatanDesain = Boolean(order.catatan_desain && order.catatan_desain.trim());
    const hasCatatanProduksi = Boolean(order.catatan_produksi && order.catatan_produksi.trim());

    const hasAnyNotes = hasCatatanOrder || hasCatatanDesain || hasCatatanProduksi;

    if (!hasAnyNotes && !showEmpty) {
        return null;
    }

    return (
        <div className={`bg-panel rounded-md border border-line p-5 shadow-sm space-y-4 ${className}`}>
            <div className="flex items-center justify-between pb-3 border-b border-line">
                <div className="flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-ink-soft" />
                    <h3 className="font-oswald text-[16px] font-bold text-ink uppercase tracking-wide">
                        {title}
                    </h3>
                </div>
                {hasAnyNotes && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Ada Catatan
                    </span>
                )}
            </div>

            {!hasAnyNotes ? (
                <div className="p-4 rounded border border-dashed border-line bg-body/50 text-center text-[12px] text-ink-soft flex items-center justify-center gap-2">
                    <InformationCircleIcon className="w-4 h-4 text-ink-lighter" />
                    Tidak ada catatan khusus untuk order ini.
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Catatan Order (Umum / Kustomer) */}
                    {hasCatatanOrder && (
                        <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-3.5 text-[13px]">
                            <div className="flex items-center gap-2 mb-1.5 text-amber-900 font-bold text-[12px] uppercase tracking-wider">
                                <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-amber-700" />
                                <span>Catatan Order / Umum</span>
                            </div>
                            <div className="text-amber-950 whitespace-pre-line leading-relaxed font-sans pl-6">
                                {order.catatan}
                            </div>
                        </div>
                    )}

                    {/* Catatan Desain */}
                    {hasCatatanDesain && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 text-[13px]">
                            <div className="flex items-center gap-2 mb-1.5 text-blue-900 font-bold text-[12px] uppercase tracking-wider">
                                <PaintBrushIcon className="w-4 h-4 text-blue-700" />
                                <span>Catatan Desain</span>
                            </div>
                            <div className="text-blue-950 whitespace-pre-line leading-relaxed font-sans pl-6">
                                {order.catatan_desain}
                            </div>
                        </div>
                    )}

                    {/* Catatan Produksi */}
                    {hasCatatanProduksi && (
                        <div className="rounded-lg border border-emerald-300 bg-emerald-50/70 p-3.5 text-[13px]">
                            <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-bold text-[12px] uppercase tracking-wider">
                                <WrenchScrewdriverIcon className="w-4 h-4 text-emerald-700" />
                                <span>Catatan Produksi</span>
                            </div>
                            <div className="text-emerald-950 whitespace-pre-line leading-relaxed font-sans pl-6">
                                {order.catatan_produksi}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
