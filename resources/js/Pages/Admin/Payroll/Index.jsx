import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { FileText, PlayCircle, DollarSign, Calculator } from 'lucide-react';

export default function Index({ payrolls, currentMonth, currentYear }) {
    const generateForm = useForm({
        month: currentMonth,
        year: currentYear
    });

    const handleGenerate = (e) => {
        e.preventDefault();
        if (confirm(`Yakin ingin generate/kalkulasi ulang gaji untuk bulan ${currentMonth}/${currentYear}?`)) {
            generateForm.post('/admin/payrolls/generate');
        }
    };

    // Helper formatter rupiah
    const formatRp = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="w-8 h-8 text-indigo-600" />
                            Laporan Payroll Bulanan
                        </h1>
                        <p className="text-gray-500 mt-1">Periode: {currentMonth} / {currentYear}</p>
                    </div>

                    {/* Form Generate */}
                    <form onSubmit={handleGenerate} className="flex gap-4">
                        <select 
                            value={generateForm.data.month} 
                            onChange={e => generateForm.setData('month', e.target.value)}
                            className="rounded-lg border-gray-300 shadow-sm text-sm"
                        >
                            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Bulan {m}</option>
                            ))}
                        </select>
                        <select 
                            value={generateForm.data.year} 
                            onChange={e => generateForm.setData('year', e.target.value)}
                            className="rounded-lg border-gray-300 shadow-sm text-sm"
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <button 
                            type="submit" 
                            disabled={generateForm.processing}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-700 transition"
                        >
                            <Calculator size={18} />
                            {generateForm.processing ? 'Memproses...' : 'Generate Payroll'}
                        </button>
                    </form>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-xl text-green-600"><DollarSign size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Gaji Dibayarkan</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {formatRp(payrolls.reduce((sum, p) => sum + Number(p.net_salary), 0))}
                            </h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-orange-100 p-4 rounded-xl text-orange-600"><FileText size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Potongan Telat</p>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {formatRp(payrolls.reduce((sum, p) => sum + Number(p.deduction_total), 0))}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Tabel Laporan Gaji */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4">Nama Karyawan</th>
                                    <th className="px-6 py-4">Gaji Pokok</th>
                                    <th className="px-6 py-4 text-green-600">Uang Lembur (+)</th>
                                    <th className="px-6 py-4 text-red-600">Potongan Telat (-)</th>
                                    <th className="px-6 py-4 bg-gray-50">Total Gaji Bersih</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrolls.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-gray-400">
                                            Belum ada data payroll untuk bulan ini. Klik "Generate Payroll".
                                        </td>
                                    </tr>
                                ) : payrolls.map(payroll => (
                                    <tr key={payroll.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{payroll.employee_name}</td>
                                        <td className="px-6 py-4">{formatRp(payroll.base_salary_total)}</td>
                                        <td className="px-6 py-4 text-green-600">+{formatRp(payroll.overtime_pay)}</td>
                                        <td className="px-6 py-4 text-red-600">-{formatRp(payroll.deduction_total)}</td>
                                        <td className="px-6 py-4 bg-gray-50 font-bold text-gray-900">{formatRp(payroll.net_salary)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
