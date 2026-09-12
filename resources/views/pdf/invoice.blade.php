<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>INVOICE - {{ $order->no_order }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #333; margin: 0; padding: 0; }
        .top-bar { height: 10px; background-color: #29394A; width: 100%; position: absolute; top: -45px; left: -45px; right: -45px; } /* Assuming dompdf margin */
        .container { padding-top: 20px; }
        
        .header { width: 100%; margin-bottom: 20px; }
        .header td { vertical-align: middle; }
        .header-logo { width: 80px; }
        .header-logo img { width: 60px; }
        .header-company { color: #29394A; }
        .header-company h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .header-company p { margin: 3px 0 0 0; color: #777; font-size: 11px; }
        .header-title { text-align: right; font-size: 28px; color: #B0B0B0; font-weight: bold; letter-spacing: 8px; }
        
        .divider { border-bottom: 1px solid #E5E7EB; margin-bottom: 25px; }
        
        .meta-table { width: 100%; margin-bottom: 30px; }
        .meta-table td { vertical-align: top; }
        .meta-left { width: 45%; }
        .meta-box { background-color: #F8F9FA; padding: 15px; border-radius: 8px; }
        .meta-box table { width: 100%; }
        .meta-box td { padding: 4px 0; font-size: 12px; }
        .meta-box td:first-child { color: #666; font-weight: bold; width: 40%; }
        .badge-lunas { display: inline-block; background-color: #10B981; color: white; padding: 5px 15px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 10px; text-align: center; }
        .badge-belum { display: inline-block; background-color: #F59E0B; color: white; padding: 5px 15px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 10px; text-align: center; }
        
        .meta-right { width: 50%; padding-left: 20px; }
        .meta-right p { margin: 2px 0; font-size: 13px; }
        .meta-right .label { color: #666; font-weight: bold; font-size: 12px; margin-bottom: 8px; }
        
        .items-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 25px; }
        .items-table th { background-color: #29394A; color: white; padding: 10px; text-align: left; font-size: 12px; }
        .items-table th:first-child { border-top-left-radius: 6px; border-bottom-left-radius: 6px; }
        .items-table th:last-child { border-top-right-radius: 6px; border-bottom-right-radius: 6px; text-align: right; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
        .items-table td:last-child { text-align: right; }
        
        .summary-wrapper { width: 100%; }
        .summary-table { width: 45%; float: right; background-color: #F8F9FA; border-radius: 8px; padding: 15px; border-collapse: separate; }
        .summary-table td { padding: 6px 15px; font-size: 13px; }
        .summary-table td:first-child { color: #555; font-weight: bold; }
        .summary-table td:last-child { text-align: right; font-weight: bold; }
        .summary-divider td { border-bottom: 1px solid #E5E7EB; padding-bottom: 10px; }
        .summary-table tr:last-child td { padding-top: 10px; }
        .text-green { color: #10B981; }
        .text-red { color: #EF4444; }
        
        .clearfix { clear: both; }
        
        .bottom-section { width: 100%; margin-top: 50px; }
        .bottom-left { width: 45%; float: left; }
        .payment-info { background-color: #F0F8FF; padding: 15px; border-radius: 8px; }
        .payment-info h4 { color: #0284C7; margin: 0 0 5px 0; font-size: 13px; }
        .payment-info p { color: #0369A1; margin: 0; font-size: 12px; }
        
        .bottom-right { width: 40%; float: right; text-align: center; }
        .signature-text { margin-bottom: 60px; font-size: 13px; }
        .signature-line { border-bottom: 1px solid #ccc; width: 100%; margin-bottom: 5px; }
        .signature-name { color: #777; font-size: 12px; }
        
        .footer { text-align: center; color: #9CA3AF; font-style: italic; font-size: 11px; margin-top: 60px; }
    </style>
</head>
<body>
    @php
        $isLunas = $order->sisa_bayar <= 0;
    @endphp

    <div class="top-bar"></div>
    
    <div class="container">
        <table class="header">
            <tr>
                @if(\App\Helpers\SettingsHelper::get('company.logo'))
                <td class="header-logo">
                    <img src="{{ public_path('storage/' . \App\Helpers\SettingsHelper::get('company.logo')) }}" alt="Logo">
                </td>
                @endif
                <td class="header-company">
                    <h1>{{ \App\Helpers\SettingsHelper::get('company.name', 'CAPOLISTA APPAREL') }}</h1>
                    <p>{{ \App\Helpers\SettingsHelper::get('company.address', 'Jl. Contoh No. 123, Kota') }}</p>
                </td>
                <td class="header-title">
                    INVOICE
                </td>
            </tr>
        </table>
        
        <div class="divider"></div>
        
        <table class="meta-table">
            <tr>
                <td class="meta-left">
                    <div class="meta-box">
                        <table>
                            <tr>
                                <td>Nomor Order:</td>
                                <td>{{ $order->no_order }}</td>
                            </tr>
                            <tr>
                                <td>Tanggal Order:</td>
                                <td>{{ \Carbon\Carbon::parse($order->tanggal_order)->format('d/m/Y') }}</td>
                            </tr>
                        </table>
                        @if($isLunas)
                            <div class="badge-lunas">LUNAS</div>
                        @else
                            <div class="badge-belum">BELUM LUNAS</div>
                        @endif
                    </div>
                </td>
                <td style="width: 5%;"></td>
                <td class="meta-right">
                    <div class="label">Kepada Yth:</div>
                    <p style="font-weight: bold; font-size: 14px;">{{ $order->customer->nama ?? '-' }}</p>
                    <p>{{ $order->customer->alamat ?? '-' }}</p>
                    <p style="margin-top: 10px;">{{ $order->customer->kontak ?? '-' }}</p>
                </td>
            </tr>
        </table>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item Produksi</th>
                    <th>Ukuran</th>
                    <th>Jumlah</th>
                    <th>Harga Satuan</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @if($order->items && $order->items->count() > 0)
                    @foreach($order->items as $item)
                        <tr>
                            <td>{{ $item->jenis_produk ?: $order->jenis_produk }}</td>
                            <td>{{ $item->ukuran ?: 'All' }}</td>
                            <td>{{ $item->jumlah_pcs }} pcs</td>
                            <td>{{ $item->harga_satuan ? 'Rp ' . number_format($item->harga_satuan, 0, ',', '.') : '-' }}</td>
                            <td>{{ $item->harga_satuan ? 'Rp ' . number_format($item->harga_satuan * $item->jumlah_pcs, 0, ',', '.') : '-' }}</td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td>{{ $order->jenis_produk }}</td>
                        <td>All</td>
                        <td>{{ $order->jumlah }} pcs</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                @endif
            </tbody>
        </table>
        
        <div class="summary-wrapper">
            <table class="summary-table">
                <tr class="summary-divider">
                    <td>Total Harga:</td>
                    <td>Rp {{ number_format($order->total_harga, 0, ',', '.') }}</td>
                </tr>
                <tr class="summary-divider">
                    <td>Sudah Dibayar (DP):</td>
                    <td class="text-green">Rp {{ number_format($order->dp, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>Sisa Bayar:</td>
                    <td class="text-red">Rp {{ number_format($order->sisa_bayar, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>
        
        <div class="clearfix"></div>
        
        <div class="bottom-section">
            <div class="bottom-left">
                <div class="payment-info">
                    <h4>Informasi Pembayaran</h4>
                    <p>{{ \App\Helpers\SettingsHelper::get('company.bank_account', 'Belum ada informasi rekening.') }}</p>
                </div>
            </div>
            
            <div class="bottom-right">
                <div class="signature-text">Hormat Kami,</div>
                <div class="signature-line"></div>
                <div class="signature-name">( Capolista Apparel )</div>
            </div>
        </div>
        
        <div class="clearfix"></div>
        
        <div class="footer">
            Terima kasih atas pesanan Anda.
        </div>
    </div>
</body>
</html>
