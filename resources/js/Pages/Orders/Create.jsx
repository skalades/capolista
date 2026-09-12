import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function OrderCreate({ customers = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        nama_kustomer: '',
        nomor_kontak: '',
        alamat_pengiriman: '',
        items: [
            { jenis_produk: '', ukuran_detail: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }, jumlah: 0, harga_satuan: '' }
        ],
        jumlah: 0,
        tanggal_order: new Date().toISOString().split('T')[0],
        deadline: '',
        harga_satuan: '', // Keep for backward compat or just ignore
        total_harga: '',
        dp: '',
        catatan_desain: '',
        catatan: '',
    });

    const [isUploadDisabled, setIsUploadDisabled] = useState(true);

    // Auto-calculate Total Jumlah & Total Harga based on Sizes and Harga Satuan per item
    useEffect(() => {
        let totalAll = 0;
        let totalHarga = 0;
        let changed = false;
        
        const newItems = data.items.map((item, index) => {
            const itemTotal = Object.values(item.ukuran_detail).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
            if (item.jumlah !== itemTotal) changed = true;
            totalAll += itemTotal;
            
            const harga = parseInt((item.harga_satuan || '').toString().replace(/\D/g, '')) || 0;
            totalHarga += (itemTotal * harga);
            
            return { ...item, jumlah: itemTotal };
        });

        if (changed || totalAll !== data.jumlah || (totalHarga > 0 && totalHarga.toString() !== data.total_harga)) {
            setData(d => ({ 
                ...d, 
                items: newItems, 
                jumlah: totalAll,
                total_harga: totalHarga > 0 ? totalHarga.toString() : d.total_harga
            }));
        }
    }, [data.items]);

    const handleUkuranChange = (index, size, value) => {
        const parsed = parseInt(value);
        const newItems = [...data.items];
        newItems[index].ukuran_detail = {
            ...newItems[index].ukuran_detail,
            [size]: isNaN(parsed) ? '' : parsed
        };
        setData('items', newItems);
    };

    // Auto-fill customer details when a known customer is selected
    useEffect(() => {
        if (data.nama_kustomer && customers) {
            const customer = customers.find(c => c.nama.toLowerCase() === data.nama_kustomer.toLowerCase());
            if (customer) {
                if (customer.kontak && !data.nomor_kontak) {
                    setData('nomor_kontak', customer.kontak);
                }
                if (customer.alamat && !data.alamat_pengiriman) {
                    setData('alamat_pengiriman', customer.alamat);
                }
            }
        }
    }, [data.nama_kustomer]);

    const handleJenisProdukChange = (index, value) => {
        const newItems = [...data.items];
        newItems[index].jenis_produk = value;
        setData('items', newItems);
    };

    const handleItemHargaChange = (index, value) => {
        const newItems = [...data.items];
        const numericValue = value.replace(/\D/g, '');
        newItems[index].harga_satuan = numericValue;
        setData('items', newItems);
    };

    const addItem = () => {
        setData('items', [
            ...data.items, 
            { jenis_produk: '', ukuran_detail: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 }, jumlah: 0, harga_satuan: '' }
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const formatRupiahInput = (value) => {
        if (!value && value !== 0) return '';
        const number = parseInt(value.toString().replace(/\D/g, ''), 10);
        return isNaN(number) ? '' : 'Rp ' + number.toLocaleString('id-ID');
    };

    const handleNumberChange = (field, value) => {
        const numericValue = value.replace(/\D/g, '');
        setData(field, numericValue);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AppLayout title="Buat Order Baru">
            <Head title="Buat Order Baru" />

            <div className="max-w-5xl mx-auto space-y-6 pb-20">
                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-6">
                    <Link 
                        href={route('orders.index')} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3EFE6] border border-line rounded-full text-[13px] font-bold text-ink hover:bg-line/30 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Kembali
                    </Link>

                    <button
                        onClick={submit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy border border-transparent rounded-full text-[13px] font-bold text-white shadow-sm hover:bg-navy/90 transition-colors disabled:opacity-50"
                    >
                        <DocumentTextIcon className="w-4 h-4" />
                        Simpan Order
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    
                    {/* DATA KUSTOMER */}
                    <div className="bg-panel rounded-md border border-line p-6 shadow-sm">
                        <h2 className="font-oswald text-[18px] font-bold text-ink mb-4 pb-2 border-b border-line uppercase tracking-wide">
                            Data Kustomer
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                    Nama Kustomer / Instansi
                                </label>
                                <input
                                    type="text"
                                    list="customers-list"
                                    value={data.nama_kustomer}
                                    onChange={e => setData('nama_kustomer', e.target.value)}
                                    placeholder="Mis. Universitas Brawijaya"
                                    className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2"
                                />
                                <datalist id="customers-list">
                                    {customers.map(c => (
                                        <option key={c.id} value={c.nama} />
                                    ))}
                                </datalist>
                                {errors.nama_kustomer && <p className="mt-1 text-[11px] text-danger">{errors.nama_kustomer}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                    Nomor Kontak (WA)
                                </label>
                                <input
                                    type="text"
                                    value={data.nomor_kontak}
                                    onChange={e => setData('nomor_kontak', e.target.value)}
                                    placeholder="08123456789"
                                    className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2"
                                />
                                {errors.nomor_kontak && <p className="mt-1 text-[11px] text-danger">{errors.nomor_kontak}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                Alamat Pengiriman
                            </label>
                            <textarea
                                rows={3}
                                value={data.alamat_pengiriman}
                                onChange={e => setData('alamat_pengiriman', e.target.value)}
                                placeholder="Alamat lengkap kustomer..."
                                className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2 resize-none"
                            />
                        </div>
                    </div>

                    {/* DETAIL PRODUK & UKURAN */}
                    <div className="bg-panel rounded-md border border-line p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-line">
                            <h2 className="font-oswald text-[18px] font-bold text-ink uppercase tracking-wide">
                                Detail Produk & Ukuran
                            </h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-[12px] font-bold text-navy hover:text-navy/80 bg-navy/10 px-3 py-1.5 rounded-full transition-colors"
                            >
                                + Tambah Produk
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                Batas Waktu (Deadline)
                            </label>
                            <input
                                type="date"
                                value={data.deadline}
                                onChange={e => setData('deadline', e.target.value)}
                                className="block w-full md:w-1/2 border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2"
                            />
                            {errors.deadline && <p className="mt-1 text-[11px] text-danger">{errors.deadline}</p>}
                        </div>

                        <div className="space-y-6">
                            {data.items.map((item, index) => (
                                <div key={index} className="p-4 bg-white border border-line rounded-md relative group">
                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="absolute top-4 right-4 text-[11px] font-bold text-danger hover:text-danger/80 bg-danger/10 px-2 py-1 rounded transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                                Jenis Produk #{index + 1}
                                            </label>
                                            <select
                                                value={item.jenis_produk}
                                                onChange={e => handleJenisProdukChange(index, e.target.value)}
                                                className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2"
                                            >
                                                <option value="">Pilih Jenis Produk...</option>
                                                <option value="Kaos Oblong">Kaos Oblong</option>
                                                <option value="Kemeja PDH">Kemeja PDH</option>
                                                <option value="Jaket">Jaket</option>
                                                <option value="Jersey">Jersey</option>
                                                <option value="Celana">Celana</option>
                                                <option value="Lainnya">Lainnya...</option>
                                            </select>
                                            {errors[`items.${index}.jenis_produk`] && <p className="mt-1 text-[11px] text-danger">{errors[`items.${index}.jenis_produk`]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                                Harga Satuan (Rp)
                                            </label>
                                            <input
                                                type="text"
                                                value={formatRupiahInput(item.harga_satuan)}
                                                onChange={e => handleItemHargaChange(index, e.target.value)}
                                                placeholder="Contoh: 100.000"
                                                className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-2">
                                            Rincian Ukuran (Pcs)
                                        </label>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                            {Object.keys(item.ukuran_detail).map(size => (
                                                <div key={size} className="flex items-center gap-3">
                                                    <span className="font-bold text-[14px] text-ink w-4">{size}</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.ukuran_detail[size] || ''}
                                                        onChange={e => handleUkuranChange(index, size, e.target.value)}
                                                        placeholder="0"
                                                        className="block w-24 border-line bg-white rounded-md text-[13px] text-center font-semibold text-ink focus:ring-navy focus:border-navy py-1.5"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-line border-dashed flex justify-between items-center text-[12px]">
                            <span className="text-ink-soft">Total Seluruh Item (Otomatis):</span>
                            <span className="font-bold text-ink text-[14px] bg-bg px-3 py-1 rounded border border-line">{data.jumlah || 0} Pcs</span>
                        </div>
                    </div>

                    {/* TWO COLUMNS: PEMBAYARAN & DESAIN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* PEMBAYARAN */}
                        <div className="bg-panel rounded-md border border-line p-6 shadow-sm">
                            <h2 className="font-oswald text-[18px] font-bold text-ink mb-4 pb-2 border-b border-line uppercase tracking-wide">
                                Pembayaran
                            </h2>

                            <div className="space-y-5">

                                <div>
                                    <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                        Total Harga (Rp)
                                    </label>
                                    <input
                                        type="text"
                                        value={formatRupiahInput(data.total_harga)}
                                        onChange={e => handleNumberChange('total_harga', e.target.value)}
                                        placeholder="Rp 0"
                                        className="block w-full border-line bg-gray-50 rounded-md text-[13px] font-semibold text-ink focus:ring-navy focus:border-navy py-2"
                                    />
                                    <p className="mt-1 text-[10px] text-ink-soft">Dihitung otomatis dari Jumlah Pcs x Harga Satuan (Bisa diubah manual)</p>
                                    {errors.total_harga && <p className="mt-1 text-[11px] text-danger">{errors.total_harga}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                        Uang Muka / DP (Rp)
                                    </label>
                                    <input
                                        type="text"
                                        value={formatRupiahInput(data.dp)}
                                        onChange={e => handleNumberChange('dp', e.target.value)}
                                        placeholder="Rp 0"
                                        className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* DESAIN & LAMPIRAN */}
                        <div className="bg-panel rounded-md border border-line p-6 shadow-sm">
                            <h2 className="font-oswald text-[18px] font-bold text-ink mb-4 pb-2 border-b border-line uppercase tracking-wide">
                                Desain & Lampiran
                            </h2>

                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-line px-6 py-12 bg-white/50 relative">
                                <div className="text-center">
                                    <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-ink-soft mb-3" aria-hidden="true" />
                                    <div className="mt-4 flex flex-col text-[13px] leading-6 text-ink-soft">
                                        <span className="font-bold text-ink">Klik untuk unggah file desain</span>
                                        <span className="text-[11px] mt-1">Sistem Upload dinonaktifkan sementara</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CATATAN */}
                    <div className="bg-panel rounded-md border border-line p-6 shadow-sm">
                        <h2 className="font-oswald text-[18px] font-bold text-ink mb-4 pb-2 border-b border-line uppercase tracking-wide">
                            Catatan
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                    Catatan Desain
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.catatan_desain}
                                    onChange={e => setData('catatan_desain', e.target.value)}
                                    placeholder="Instruksi khusus desain (warna, sablon, letak logo, dll)..."
                                    className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-medium text-ink-soft uppercase tracking-wider mb-1.5">
                                    Catatan Tambahan (Internal/Produksi)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.catatan}
                                    onChange={e => setData('catatan', e.target.value)}
                                    placeholder="Catatan untuk bagian produksi atau admin..."
                                    className="block w-full border-line bg-white rounded-md text-[13px] text-ink focus:ring-navy focus:border-navy py-2 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
