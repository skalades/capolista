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
