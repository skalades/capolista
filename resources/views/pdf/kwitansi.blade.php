<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kwitansi Pembayaran - {{ $pembayaran->order->no_order }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { display: table; width: 100%; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header-left { display: table-cell; width: 50%; vertical-align: top; }
        .header-right { display: table-cell; width: 50%; text-align: right; vertical-align: top; }
        .header h1 { margin: 0; font-size: 24px; color: #333; }
        .company-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .content { margin-top: 20px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 8px 0; }
        .info-table td:first-child { width: 150px; font-weight: bold; }
        .amount-box { 
            background-color: #f2f2f2; 
            padding: 15px; 
            font-size: 18px; 
            font-weight: bold; 
            border: 1px solid #ddd;
            display: inline-block;
            margin-top: 10px;
        }
        .history-section { width: 100%; margin-top: 30px; margin-bottom: 20px; }
        .history-section h3 { color: #29394A; font-size: 13px; margin: 0 0 10px 0; border-left: 4px solid #29394A; padding-left: 10px; }
        .history-table { width: 100%; border-collapse: collapse; }
        .history-table th { background-color: #F1F5F9; color: #29394A; padding: 7px 10px; text-align: left; font-size: 11px; border-bottom: 2px solid #CBD5E1; }
        .history-table th:last-child { text-align: right; }
        .history-table td { padding: 7px 10px; font-size: 12px; border-bottom: 1px solid #E5E7EB; }
        .history-table td:last-child { text-align: right; }
        .history-table tr.current-row td { background-color: #F0FDF4; font-weight: bold; }
        .badge-tipe { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .badge-dp { background-color: #DBEAFE; color: #1D4ED8; }
        .badge-pelunasan { background-color: #D1FAE5; color: #065F46; }
        .badge-lainnya { background-color: #F3F4F6; color: #374151; }
        .badge-metode { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: bold; background-color: #FEF3C7; color: #92400E; }
        .history-empty { color: #9CA3AF; font-size: 12px; padding: 10px 0; text-align: center; }
        .signature-section { margin-top: 50px; display: table; width: 100%; }
        .signature-box { display: table-cell; width: 30%; text-align: center; }
        .signature-line { border-bottom: 1px solid #000; margin-top: 60px; width: 100%; }
        .footer { margin-top: 50px; font-size: 12px; color: #555; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            @if(\App\Helpers\SettingsHelper::get('company.logo'))
                <img src="{{ public_path('storage/' . \App\Helpers\SettingsHelper::get('company.logo')) }}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;">
            @endif
            <div class="company-name">{{ \App\Helpers\SettingsHelper::get('company.name', 'CAPOLISTA') }}</div>
            <p style="margin:0;">{!! nl2br(e(\App\Helpers\SettingsHelper::get('company.address', 'Alamat Perusahaan'))) !!}</p>
        </div>
        <div class="header-right">
            <h1>TANDA TERIMA</h1>
            <p>No. Order: <strong>{{ $pembayaran->order->no_order }}</strong><br>Tanggal: {{ \Carbon\Carbon::parse($pembayaran->tanggal)->format('d M Y') }}</p>
        </div>
    </div>

    <div class="content">
        <table class="info-table">
            <tr>
                <td>Telah Terima Dari</td>
                <td>: {{ $pembayaran->order->customer->nama ?? '-' }}</td>
            </tr>
            <tr>
                <td>Untuk Pembayaran</td>
                <td>: Pembayaran {{ ucfirst($pembayaran->tipe) }} Order {{ $pembayaran->order->no_order }} - {{ $pembayaran->order->jenis_produk }}</td>
            </tr>
            <tr>
                <td>Metode Pembayaran</td>
                <td>: {{ ucfirst($pembayaran->metode) }}</td>
            </tr>
            @if($pembayaran->catatan)
            <tr>
                <td>Catatan</td>
                <td>: {{ $pembayaran->catatan }}</td>
            </tr>
            @endif
        </table>

        <div class="amount-box">
            Jumlah: Rp {{ number_format($pembayaran->jumlah, 0, ',', '.') }}
        </div>
    </div>

    {{-- Histori Pembayaran --}}
    <div class="history-section">
        <h3>Histori Pembayaran Order Ini</h3>
        @php
            $semuaPembayaran = $pembayaran->order->pembayarans->sortBy('tanggal');
        @endphp
        @if($semuaPembayaran->count() > 0)
            <table class="history-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tanggal</th>
                        <th>Tipe</th>
                        <th>Metode</th>
                        <th>Catatan</th>
                        <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    @php $dpCounter = 0; @endphp
                    @foreach($semuaPembayaran as $i => $bayar)
                        @php
                            $isCurrent = $bayar->id === $pembayaran->id;
                            $tipeClass = match($bayar->tipe) {
                                'dp'        => 'badge-dp',
                                'pelunasan' => 'badge-pelunasan',
                                default     => 'badge-lainnya',
                            };
                            if ($bayar->tipe === 'dp') {
                                $dpCounter++;
                                $tipeLabel = 'DP ' . $dpCounter;
                            } elseif ($bayar->tipe === 'pelunasan') {
                                $tipeLabel = 'Pelunasan';
                            } else {
                                $tipeLabel = ucfirst($bayar->tipe);
                            }
                        @endphp
                        <tr class="{{ $isCurrent ? 'current-row' : '' }}">
                            <td>{{ $loop->iteration }}</td>
                            <td>{{ \Carbon\Carbon::parse($bayar->tanggal)->format('d/m/Y') }}</td>
                            <td><span class="badge-tipe {{ $tipeClass }}">{{ $tipeLabel }}</span></td>
                            <td><span class="badge-metode">{{ ucfirst($bayar->metode) }}</span></td>
                            <td>{{ $bayar->catatan ?: '-' }}{{ $isCurrent ? ' ★' : '' }}</td>
                            <td style="color: #10B981; font-weight: bold;">Rp {{ number_format($bayar->jumlah, 0, ',', '.') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p class="history-empty">Belum ada histori pembayaran.</p>
        @endif
    </div>

    <div class="signature-section">
        <div style="display: table-cell; width: 70%;"></div>
        <div class="signature-box">
            Penerima,<br>
            <div class="signature-line"></div>
            ( {{ $pembayaran->pencatat->name ?? 'Admin' }} )
        </div>
    </div>

    <div class="footer">
        Terima kasih atas kepercayaan Anda kepada {{ \App\Helpers\SettingsHelper::get('company.name', 'CAPOLISTA') }}.
    </div>
</body>
</html>
