<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slip Gaji - {{ $penggajian->karyawan->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #222; }
        .header { display: table; width: 100%; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header-left { display: table-cell; width: 60%; vertical-align: top; }
        .header-right { display: table-cell; width: 40%; text-align: right; vertical-align: top; }
        .company-name { font-size: 20px; font-weight: bold; margin-bottom: 3px; }
        .slip-title { font-size: 16px; font-weight: bold; margin-top: 10px; color: #444; }
        .karyawan-box { background: #f5f5f5; border: 1px solid #ddd; padding: 12px; margin-bottom: 15px; }
        .karyawan-table { width: 100%; border-collapse: collapse; }
        .karyawan-table td { padding: 3px 6px; }
        .karyawan-table .label { color: #666; width: 40%; }
        .detail-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        .detail-table th { background: #333; color: #fff; padding: 7px 8px; text-align: left; font-size: 12px; }
        .detail-table td { border-bottom: 1px solid #eee; padding: 6px 8px; }
        .detail-table tr:last-child td { border-bottom: none; }
        .detail-table .num { text-align: right; }
        .summary-box { border: 2px solid #333; padding: 12px; margin-top: 15px; }
        .summary-table { width: 100%; border-collapse: collapse; }
        .summary-table td { padding: 5px 8px; }
        .summary-table .total-row { font-weight: bold; font-size: 14px; border-top: 2px solid #333; }
        .summary-table .label { width: 60%; }
        .summary-table .amount { text-align: right; }
        .potongan { color: #c00; }
        .footer { margin-top: 40px; font-size: 11px; color: #888; text-align: center; border-top: 1px solid #ddd; padding-top: 8px; }
        .signature-row { display: table; width: 100%; margin-top: 30px; }
        .sig-cell { display: table-cell; width: 33%; text-align: center; }
        .sig-line { border-bottom: 1px solid #000; margin-top: 55px; width: 80%; margin-left: auto; margin-right: auto; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        .badge-borongan { background: #dbeafe; color: #1d4ed8; }
        .badge-harian { background: #d1fae5; color: #065f46; }
        .badge-bulanan { background: #ede9fe; color: #5b21b6; }
    </style>
</head>
<body>

    {{-- Header --}}
    <div class="header">
        <div class="header-left">
            <div class="company-name">CAPOLISTA APPAREL</div>
            <div>Sistem Manajemen Konveksi CMT</div>
        </div>
        <div class="header-right">
            <div class="slip-title">SLIP GAJI</div>
            <div style="margin-top:5px;">
                Periode: {{ \Carbon\Carbon::parse($penggajian->periode_mulai)->format('d M Y') }}
                s/d {{ \Carbon\Carbon::parse($penggajian->periode_selesai)->format('d M Y') }}
            </div>
        </div>
    </div>

    {{-- Info Karyawan --}}
    <div class="karyawan-box">
        <table class="karyawan-table">
            <tr>
                <td class="label">Nama Karyawan</td>
                <td><strong>{{ $penggajian->karyawan->name }}</strong></td>
                <td class="label">Tipe Gaji</td>
                <td>
                    <span class="badge badge-{{ $penggajian->tipe_gaji }}">
                        {{ strtoupper($penggajian->tipe_gaji) }}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="label">Jabatan</td>
                <td>{{ $penggajian->karyawan->jabatan ?? '-' }}</td>
                <td class="label">Divisi</td>
                <td>{{ \App\Models\User::DIVISI_LIST[$penggajian->karyawan->divisi] ?? '-' }}</td>
            </tr>
            <tr>
                <td class="label">Tanggal Generate</td>
                <td>{{ \Carbon\Carbon::parse($penggajian->created_at)->format('d M Y') }}</td>
                <td class="label">Status</td>
                <td><strong>{{ strtoupper($penggajian->status_bayar) }}</strong></td>
            </tr>
        </table>
    </div>

    {{-- Rekap Kehadiran --}}
    @if(in_array($penggajian->tipe_gaji, ['harian', 'bulanan']))
    <table class="detail-table">
        <thead>
            <tr>
                <th colspan="4">📅 Rekap Kehadiran</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Hadir</td><td class="num">{{ $penggajian->total_hari_hadir }} hari</td>
                <td>Lembur</td><td class="num">{{ $penggajian->total_jam_lembur }} jam</td>
            </tr>
            <tr>
                <td>Izin</td><td class="num">{{ $penggajian->total_hari_izin }} hari</td>
                <td>Sakit</td><td class="num">{{ $penggajian->total_hari_sakit }} hari</td>
            </tr>
            @if($penggajian->total_hari_alpha > 0)
            <tr>
                <td class="potongan">Alpha</td>
                <td class="num potongan">{{ $penggajian->total_hari_alpha }} hari</td>
                <td></td><td></td>
            </tr>
            @endif
        </tbody>
    </table>
    @endif

    {{-- Detail Rincian --}}
    @if($penggajian->tipe_gaji === 'borongan' && $penggajian->total_pcs_approved > 0)
    <table class="detail-table">
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Order</th>
                <th>Jenis Produk</th>
                <th class="num">Pcs</th>
                <th class="num">Tarif/Pcs</th>
                <th class="num">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($penggajian->items->where('tipe_item', 'borongan') as $item)
            <tr>
                <td>{{ $item->tanggal ? \Carbon\Carbon::parse($item->tanggal)->format('d/m/Y') : '-' }}</td>
                <td>{{ $item->order->no_order ?? '-' }}</td>
                <td>{{ $item->jenis_produk ?? '-' }}</td>
                <td class="num">{{ number_format($item->pcs) }}</td>
                <td class="num">Rp {{ number_format($item->tarif, 0, ',', '.') }}</td>
                <td class="num">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            <tr style="font-weight:bold; background:#f0f0f0;">
                <td colspan="3">TOTAL</td>
                <td class="num">{{ number_format($penggajian->total_pcs_approved) }} pcs</td>
                <td></td>
                <td class="num">Rp {{ number_format($penggajian->upah_pokok, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>
    @endif

    {{-- Ringkasan Upah --}}
    <div class="summary-box">
        <table class="summary-table">
            <tr>
                <td class="label">
                    @if($penggajian->tipe_gaji === 'borongan')
                        Upah Borongan ({{ number_format($penggajian->total_pcs_approved) }} pcs)
                    @elseif($penggajian->tipe_gaji === 'harian')
                        Upah Harian ({{ $penggajian->total_hari_hadir }} hari)
                    @else
                        Gaji Pokok
                    @endif
                </td>
                <td class="amount">Rp {{ number_format($penggajian->upah_pokok, 0, ',', '.') }}</td>
            </tr>
            @if($penggajian->upah_lembur > 0)
            <tr>
                <td class="label">Upah Lembur ({{ $penggajian->total_jam_lembur }} jam)</td>
                <td class="amount">Rp {{ number_format($penggajian->upah_lembur, 0, ',', '.') }}</td>
            </tr>
            @endif
            @if($penggajian->tunjangan > 0)
            <tr>
                <td class="label">Tunjangan</td>
                <td class="amount">Rp {{ number_format($penggajian->tunjangan, 0, ',', '.') }}</td>
            </tr>
            @endif
            @if($penggajian->potongan > 0)
            <tr class="potongan">
                <td class="label">Potongan{{ $penggajian->catatan_potongan ? ' (' . $penggajian->catatan_potongan . ')' : '' }}</td>
                <td class="amount">- Rp {{ number_format($penggajian->potongan, 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td class="label">TOTAL GAJI BERSIH</td>
                <td class="amount" style="font-size:16px;">Rp {{ number_format($penggajian->total_upah_bersih, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    {{-- Tanda Tangan --}}
    <div class="signature-row">
        <div class="sig-cell">
            <div>Karyawan</div>
            <div class="sig-line"></div>
            <div style="margin-top:5px;">{{ $penggajian->karyawan->name }}</div>
        </div>
        <div class="sig-cell">
            <div>HRD</div>
            <div class="sig-line"></div>
            <div style="margin-top:5px;">{{ $penggajian->pembuat->name ?? '-' }}</div>
        </div>
        <div class="sig-cell">
            <div>Manajemen</div>
            <div class="sig-line"></div>
            <div style="margin-top:5px;">{{ $penggajian->penyetuju->name ?? '.........................' }}</div>
        </div>
    </div>

    <div class="footer">
        Slip gaji ini digenerate secara otomatis oleh Sistem Manajemen CAPOLISTA APPAREL
        &bull; Dicetak pada: {{ now()->format('d M Y H:i') }}
    </div>

</body>
</html>
